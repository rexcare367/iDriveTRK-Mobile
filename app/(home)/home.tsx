import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";

import BackgroundEffects from "@/components/BackgroundEffects";
import BottomTabBar from "@/components/BottomTabBar";
import Header from "@/components/Header";
import InsufficientBreakModal from "@/components/InsufficientBreakModal";
import CurrentActiveSchedule from "@/feature/home/CurrentActiveSchedule";
import NextSchedule from "@/feature/home/NextSchedule";
import { updateClockInForm } from "@/redux/actions/driverActions";
import { api } from "@/utils";
import { getLastClockOutTime } from "@/utils/firestore";
import {
  formatDate,
  formatDuration,
  formatTime,
  getGreeting,
} from "@/utils/helpers";

function HomeScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const { clockInFormData } = useSelector((state: any) => state.driver);

  const [currentTime, setCurrentTime] = useState(moment());
  const [timeDisplay, setTimeDisplay] = useState("");
  const [breakModalVisible, setBreakModalVisible] = useState(false);
  const [breakDuration, setBreakDuration] = useState(0);
  const [workDuration, setWorkDuration] = useState(0);
  const [insufficientBreakModalVisible, setInsufficientBreakModalVisible] =
    useState(false);
  const [hoursSinceLastShift, setHoursSinceLastShift] = useState(0);
  const [lastClockOutTime, setLastClockOutTime] = useState(null);
  const isClockedIn =
    clockInFormData &&
    clockInFormData.status &&
    clockInFormData.status !== "pending";
  const [isOnBreak, setIsOnBreak] = useState(false);
  const fullname = user?.firstName + " " + user?.lastName;

  useEffect(() => {
    if (
      clockInFormData &&
      clockInFormData.breaks &&
      clockInFormData.breaks.length > 0
    ) {
      const lastBreak =
        clockInFormData.breaks[clockInFormData.breaks.length - 1];
      setIsOnBreak(lastBreak.end === null);
    } else {
      setIsOnBreak(false);
    }
  }, [clockInFormData]);
  const ripple = useSharedValue(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = moment();
      setCurrentTime(now);
      setTimeDisplay(formatTime(now));

      if (isOnBreak && clockInFormData && clockInFormData.breaks.length > 0) {
        const breakStart = moment(
          clockInFormData.breaks[clockInFormData.breaks.length - 1].start
        );
        const breakDurationMs = now.diff(breakStart);
        setBreakDuration(Math.floor(breakDurationMs / 60000));
      }
      if (isClockedIn && clockInFormData && clockInFormData.clockin_time) {
        const clockInTimeDate = moment(clockInFormData.clockin_time);
        const workDurationMs = now.diff(clockInTimeDate);
        setWorkDuration(Math.floor(workDurationMs / 60000));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isOnBreak, isClockedIn, clockInFormData]);

  // State for storing schedules
  const [allSchedules, setAllSchedules] = useState<any[]>([]);
  const [activeSchedule, setActiveSchedule] = useState<any>(null);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [schedulesError, setSchedulesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!user?.id) return;
      setSchedulesLoading(true);
      setSchedulesError(null);
      try {
        const start_time = moment().toISOString();
        const end_time = moment().add(1, "day").toISOString();
        const response = await api.get(
          `/api/schedules?user_id=${user.id}&start_time=${encodeURIComponent(
            start_time
          )}&end_time=${encodeURIComponent(end_time)}&status=scheduled`
        );
        setAllSchedules(response.data || []);
      } catch (err) {
        setSchedulesError("Failed to fetch schedules");
        console.error("Error fetching schedules:", err);
      } finally {
        setSchedulesLoading(false);
      }
    };
    fetchSchedules();
  }, [user?.id]);

  const fetchTimesheetAndSchedule = async () => {
    if (!user?.id) return;
    try {
      const response = await api.get(
        `/api/timesheets/by-user/${user.id}/working`
      );
      if (response.data) {
        console.log("updateClockInForm .data", response.data);
        dispatch(updateClockInForm(response.data));

        // If timesheet has a schedule_id, fetch that specific schedule
        if (response.data.schedule_id) {
          try {
            const scheduleResponse = await api.get(
              `/api/schedules/${response.data.schedule_id}`
            );
            if (scheduleResponse.data) {
              setActiveSchedule(scheduleResponse.data);
            }
          } catch (err) {
            console.error("Failed to fetch schedule:", err);
            setSchedulesError("Failed to fetch schedule details");
          }
        }
      } else {
        // If no timesheet found, clear active schedule
        setActiveSchedule(null);
        // Schedules will be fetched by the other useEffect
      }
    } catch (err) {
      console.error("Failed to fetch timesheet:", err);
    }
  };

  useEffect(() => {
    ripple.value = withRepeat(withTiming(1, { duration: 1000 }), -1, false);
    fetchTimesheetAndSchedule();
  }, [user?.id]);

  const handleClockIn = async () => {
    try {
      const userId = user?.id || "";

      const lastClockOutData = await getLastClockOutTime(userId);

      if (!lastClockOutData || !lastClockOutData.timestamp) {
        proceedWithClockIn();
        return;
      }

      setLastClockOutTime(lastClockOutData.timestamp);
      const breakDurationMs = lastClockOutData.breakDuration || 0;
      const breakDurationHours = moment.duration(breakDurationMs).asHours();

      setHoursSinceLastShift(breakDurationHours);

      const sufficient = breakDurationHours >= 10;

      if (!sufficient) {
        setInsufficientBreakModalVisible(true);
      } else {
        proceedWithClockIn();
      }
    } catch (error) {
      console.error("Error checking break sufficiency:", error);
      Alert.alert("Error", "Unable to verify rest period. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  const proceedWithClockIn = () => {
    try {
      dispatch(
        updateClockInForm({
          id: uuid.v4(),
          status: "pending",
          user_id: user?.id,
          created_at: moment().toISOString(),
          breaks: [],
        })
      );
      router.push("/(home)/trip-selection");
      // router.push("/(home)/vehicle-selection");
    } catch (error) {
      console.error("Error clocking in:", error);
      Alert.alert(
        "Clock In Failed",
        "Unable to clock in at this time. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handleClockOut = async () => {
    router.push("/(home)/(post-trip)/post-trip-screen");
  };

  const handleInsufficientBreakCancel = () => {
    setInsufficientBreakModalVisible(false);
  };

  const handleInsufficientBreakContinue = () => {
    setInsufficientBreakModalVisible(false);

    setTimeout(() => {
      proceedWithClockIn();
    }, 200);
  };

  const handleBreakAction = async () => {
    if (isOnBreak) {
      // dispatch(endBreak());
      const updatedBreaks = [...clockInFormData.breaks];
      if (updatedBreaks.length > 0) {
        // Set end time of the last break
        updatedBreaks[updatedBreaks.length - 1] = {
          ...updatedBreaks[updatedBreaks.length - 1],
          end: moment().toISOString(),
        };
      }
      const updatedClockInFormData = {
        ...clockInFormData,
        breaks: updatedBreaks,
      };
      dispatch(updateClockInForm(updatedClockInFormData));

      await api.post(`api/breaks`, {
        timesheet_id: clockInFormData.id,
        break_start: updatedBreaks[updatedBreaks.length - 1].start,
        break_end: moment().toISOString(),
        break_type: "break",
        is_active: true,
        break_minutes: moment().diff(
          updatedBreaks[updatedBreaks.length - 1].start,
          "minutes"
        ),
      });

      await api.patch(`api/timesheets/by-id/${clockInFormData.id}`, {
        breaks: updatedBreaks,
      });
    } else {
      setBreakModalVisible(true);
    }
  };

  const confirmStartBreak = async () => {
    const updatedClockInFormData = {
      ...clockInFormData,
      breaks: [
        ...clockInFormData.breaks,
        { id: uuid.v4(), start: moment().toISOString(), end: null },
      ],
    };

    dispatch(updateClockInForm(updatedClockInFormData));

    // call backend api to update clockInFormData
    await api.patch(`api/timesheets/by-id/${clockInFormData.id}`, {
      breaks: updatedClockInFormData.breaks,
    });
    setBreakModalVisible(false);
  };

  // const chartData = {
  //   labels: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
  //   datasets: [
  //     {
  //       data: [20, 45, 28, 80, 99, 43, 50],
  //       color: (opacity = 1) => `rgba(0, 75, 135, ${opacity})`,
  //       strokeWidth: 2,
  //     },
  //   ],
  // };

  // const chartConfig = {
  //   backgroundGradientFrom: "#ffffff",
  //   backgroundGradientTo: "#ffffff",
  //   decimalPlaces: 0,
  //   color: (opacity = 1) => `rgba(0, 75, 135, ${opacity})`,
  //   labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  //   style: {
  //     borderRadius: 16,
  //   },
  //   propsForDots: {
  //     r: "6",
  //     strokeWidth: "2",
  //     stroke: "#082640",
  //   },
  // };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundEffects />

      <Header />

      <ScrollView style={styles.content}>
        <Text style={styles.greeting}>{getGreeting(currentTime)}</Text>
        <Text style={styles.name}>{fullname}!</Text>
        {isClockedIn ? (
          <View style={styles.clockedInContainer}>
            <TouchableOpacity style={styles.statusContainer}>
              <View style={styles.statusIndicator}>
                <View
                  style={[
                    styles.statusDot,
                    isOnBreak ? styles.breakStatusDot : styles.activeStatusDot,
                  ]}
                />
                <Text style={styles.statusText}>
                  {isOnBreak ? "On Break" : "Clocked In"}
                </Text>
              </View>
              <Text style={styles.durationText}>
                {isOnBreak
                  ? `Break: ${formatDuration(breakDuration)}`
                  : `Working: ${formatDuration(workDuration)}`}
              </Text>
            </TouchableOpacity>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  isOnBreak ? styles.returnButton : styles.breakButton,
                ]}
                onPress={handleBreakAction}
              >
                <Ionicons
                  name={
                    isOnBreak ? "play-circle-outline" : "pause-circle-outline"
                  }
                  size={24}
                  color="white"
                />
                <Text style={styles.actionButtonText}>
                  {isOnBreak ? "Return to Work" : "Start Break"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.clockOutButton}
                onPress={handleClockOut}
              >
                <Ionicons name="log-out-outline" size={24} color="white" />
                <Text style={styles.actionButtonText}>Clock Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.clockInContainer}>
            <View style={styles.clockInOuterCircle}>
              <TouchableOpacity
                style={[styles.clockInButton]}
                onPress={handleClockIn}
                activeOpacity={0.8}
              >
                <Text style={styles.clockInText}>Clock in</Text>
                <Text style={styles.timeText}>{timeDisplay}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Text style={styles.dateText}>{formatDate(currentTime)}</Text>

        <CurrentActiveSchedule schedule={activeSchedule} />

        <NextSchedule />

        {/* <View style={styles.tripOverviewContainer}>
          <View style={styles.tripOverviewHeader}>
            <Text style={styles.tripOverviewTitle}>Trip Overview</Text>
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownText}>Weekly</Text>
            </View>
          </View>

          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.checkInDot]} />
              <Text style={styles.legendText}>Check in</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.checkOutDot]} />
              <Text style={styles.legendText}>Check out</Text>
            </View>
          </View>
        </View> */}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={breakModalVisible}
        onRequestClose={() => setBreakModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Start Break</Text>
            <Text style={styles.modalText}>
              You are about to start your break. Your work time will be paused
              until you return.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setBreakModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={confirmStartBreak}
              >
                <Text style={styles.modalConfirmButtonText}>Start Break</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <InsufficientBreakModal
        visible={insufficientBreakModalVisible}
        onCancel={handleInsufficientBreakCancel}
        onContinue={handleInsufficientBreakContinue}
        lastClockOutTime={lastClockOutTime}
        hoursSinceLastShift={hoursSinceLastShift}
      />
      <BottomTabBar activeTab="Home" onTabPress={() => {}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "500",
    marginTop: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  clockedInContainer: {
    marginBottom: 20,
  },
  statusContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  activeStatusDot: {
    backgroundColor: "#4CAF50",
  },
  breakStatusDot: {
    backgroundColor: "#FFC107",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },
  durationText: {
    fontSize: 14,
    color: "#666",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  breakButton: {
    backgroundColor: "#FFC107",
  },
  returnButton: {
    backgroundColor: "#4CAF50",
  },
  clockOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#F44336",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 5,
  },
  dateText: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  clockInContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  clockInOuterCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  clockInButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#082640",
    justifyContent: "center",
    alignItems: "center",
  },
  clockInText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  timeText: {
    color: "#9B9696FF",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "#f5f5f5",
  },
  modalConfirmButton: {
    backgroundColor: "#FFC107",
  },
  modalCancelButtonText: {
    color: "#666",
    fontWeight: "600",
  },
  modalConfirmButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default HomeScreen;
