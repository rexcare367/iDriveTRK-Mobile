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
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import BackgroundEffects from "../../components/BackgroundEffects";
import BottomTabBar from "../../components/BottomTabBar";
import EmptyState from "../../components/EmptyState";
import Header from "../../components/Header";
import InsufficientBreakModal from "../../components/InsufficientBreakModal";
import {
  clockOut,
  selectTrip,
  updateClockInForm,
} from "../../redux/actions/driverActions";
import { api } from "../../utils";
import { getLastClockOutTime } from "../../utils/firestore";

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

  // Update isOnBreak whenever clockInFormData changes
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

      if (isOnBreak) {
        const breakStart = moment(
          clockInFormData.breaks[clockInFormData.breaks.length - 1].start
        );
        const breakDurationMs = now.diff(breakStart);
        setBreakDuration(Math.floor(breakDurationMs / 60000));
      }
      if (isClockedIn && clockInFormData.clockin_time) {
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
        console.log("response.data", response.data);
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

  const formatTime = (dateOrMoment: any) => {
    const m = moment.isMoment(dateOrMoment)
      ? dateOrMoment
      : moment(dateOrMoment);
    return m.format("h:mm a");
  };

  const formatDate = (dateOrMoment: any) => {
    const m = moment.isMoment(dateOrMoment)
      ? dateOrMoment
      : moment(dateOrMoment);
    return m.format("dddd Do MMMM, YYYY");
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

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
          userId: user?.id,
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
    try {
      await (dispatch as any)(clockOut());

      const clockOutData = {
        clockout_time: moment().toISOString(),
        status: "clockOut",
      };

      const apiResult = await api.patch(
        `api/timesheets/by-id/${clockInFormData.id}`,
        clockOutData
      );

      if (apiResult?.data?.success || apiResult?.status === 200) {
        console.log("Clock-out successful");
        // Refresh timesheet and schedule data
        await fetchTimesheetAndSchedule();
      } else {
        console.error("Failed to save clock-out data", apiResult);
      }
    } catch (error) {
      console.error("Error during clock-out:", error);
    }
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

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
        color: (opacity = 1) => `rgba(0, 75, 135, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 75, 135, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#082640",
    },
  };

  const getGreeting = (date: any) => {
    const m = moment.isMoment(date) ? date : moment(date);
    const hour = m.hour();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";

  return (
    <View style={styles.container}>
      <BackgroundEffects />

      <Header />

      <ScrollView style={styles.content}>
        <Text style={styles.greeting}>{getGreeting(currentTime)}</Text>
        <Text style={styles.name}>
          {firstName} {lastName}!
        </Text>
        {isClockedIn ? (
          <View style={styles.clockedInContainer}>
            <TouchableOpacity
              style={styles.statusContainer}
              onPress={handleClockIn}
            >
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

        {activeSchedule ? (
          <View style={styles.todaysTripContainer}>
            <View style={styles.todaysTripHeader}>
              <Text style={styles.todaysTripTitle}>Your current Trip</Text>
            </View>

            <View style={styles.tripCard}>
              {(() => {
                try {
                  if (!activeSchedule.job) {
                    throw new Error("Job information is missing");
                  }

                  return (
                    <>
                      <View style={styles.tripHeader}>
                        <Text style={styles.tripName}>
                          {activeSchedule.job?.name || "Untitled Trip"}
                        </Text>
                        <View style={styles.tripTime}>
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color="#082640"
                          />
                          <Text style={styles.tripTimeText}>
                            {activeSchedule.start_time
                              ? `${moment(activeSchedule.start_time).format(
                                  "h:mm A"
                                )} - ${moment(activeSchedule.end_time).format(
                                  "h:mm A"
                                )}`
                              : "Time not set"}
                          </Text>
                        </View>
                      </View>

                      {activeSchedule.job.description && (
                        <Text
                          style={{
                            fontSize: 13,
                            color: "#666",
                            marginBottom: 8,
                          }}
                        >
                          {activeSchedule.job.description}
                        </Text>
                      )}

                      {Array.isArray(activeSchedule.job.routes) &&
                        activeSchedule.job.routes.length > 0 && (
                          <View style={styles.tripStops}>
                            {activeSchedule.job.routes.map(
                              (stop: any, index: number) => (
                                <View key={index} style={styles.tripStop}>
                                  <View style={styles.stopDot} />
                                  <Text style={styles.stopName}>
                                    {stop?.label || "Unnamed Stop"}
                                  </Text>
                                </View>
                              )
                            )}
                          </View>
                        )}

                      <View style={styles.tripMeta}>
                        {activeSchedule.job.driving_distance && (
                          <View style={styles.tripMetaItem}>
                            <Ionicons
                              name="speedometer-outline"
                              size={14}
                              color="#666"
                            />
                            <Text style={styles.tripMetaText}>
                              {activeSchedule.job.driving_distance}
                            </Text>
                          </View>
                        )}
                        {activeSchedule.start_time &&
                          activeSchedule.end_time && (
                            <View style={styles.tripMetaItem}>
                              <Ionicons
                                name="hourglass-outline"
                                size={14}
                                color="#666"
                              />
                              <Text style={styles.tripMetaText}>
                                {`${moment(activeSchedule.end_time).diff(
                                  moment(activeSchedule.start_time),
                                  "minutes"
                                )} min`}
                              </Text>
                            </View>
                          )}
                      </View>

                      <TouchableOpacity
                        style={styles.viewTripButton}
                        // onPress={() =>
                        //   navigation.navigate("TripDetailsHistory", {
                        //     tripId: activeSchedule.id,
                        //   })
                        // }

                        onPress={() => {
                          dispatch(selectTrip(activeSchedule, []));
                          // For now, navigate to trip-selection since trip-stops doesn't exist
                          router.push({
                            pathname: "/(home)/trip-details",
                            params: {
                              tripId: activeSchedule.id,
                              tripName: activeSchedule.name,
                              isAssigned: "true",
                            },
                          });
                        }}
                      >
                        <Text style={styles.viewTripButtonText}>
                          View Trip Details
                        </Text>
                        <Ionicons
                          name="arrow-forward"
                          size={16}
                          color="#082640"
                        />
                      </TouchableOpacity>
                    </>
                  );
                } catch (error) {
                  console.error("Error rendering trip card:", error);
                  return (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>
                        Unable to display trip details. Please try again later.
                      </Text>
                    </View>
                  );
                }
              })()}
            </View>
          </View>
        ) : null}

        <View style={styles.todaysTripContainer}>
          <View style={styles.todaysTripHeader}>
            <Text style={styles.todaysTripTitle}>Next Scheduled Trip</Text>
            <TouchableOpacity
              onPress={() => router.push("/(home)/trip-selection")}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {schedulesLoading ? (
            <Text
              style={{ textAlign: "center", color: "#888", marginVertical: 20 }}
            >
              Loading assigned trips...
            </Text>
          ) : schedulesError ? (
            <EmptyState
              icon="alarm-outline"
              text={schedulesError}
              subtext="Clock in to start tracking your time"
            />
          ) : allSchedules.length > 0 ? (
            (() => {
              const schedule = allSchedules[0];
              const job = schedule.job || {};
              const scheduler = schedule.scheduler || {};
              const tripName = job.name || scheduler.title || "Trip";
              const description = job.description || "";
              const startTime = schedule.start_time
                ? moment(schedule.start_time)
                : null;
              const endTime = schedule.end_time
                ? moment(schedule.end_time)
                : null;
              const timeStr =
                startTime && endTime
                  ? `${startTime.format("h:mm A")} - ${endTime.format(
                      "h:mm A"
                    )}`
                  : "";
              const stops = Array.isArray(job.routes) ? job.routes : [];
              const distance = job.driving_distance
                ? `${job.driving_distance} km`
                : "";
              return (
                <View style={styles.tripCard}>
                  <View style={styles.tripHeader}>
                    <Text style={styles.tripName}>{tripName}</Text>
                    <View style={styles.tripTime}>
                      <Ionicons name="time-outline" size={16} color="#082640" />
                      <Text style={styles.tripTimeText}>{timeStr}</Text>
                    </View>
                  </View>
                  {description ? (
                    <Text
                      style={{ fontSize: 13, color: "#666", marginBottom: 8 }}
                    >
                      {description}
                    </Text>
                  ) : null}
                  {stops.length > 0 && (
                    <View style={styles.tripStops}>
                      {stops.map((stop: any, index: number) => (
                        <View key={index} style={styles.tripStop}>
                          <View style={styles.stopDot} />
                          <Text style={styles.stopName}>{stop.label}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <View style={styles.tripMeta}>
                    {distance && (
                      <View style={styles.tripMetaItem}>
                        <Ionicons
                          name="speedometer-outline"
                          size={14}
                          color="#666"
                        />
                        <Text style={styles.tripMetaText}>{distance}</Text>
                      </View>
                    )}
                    {startTime && endTime && (
                      <View style={styles.tripMetaItem}>
                        <Ionicons
                          name="hourglass-outline"
                          size={14}
                          color="#666"
                        />
                        <Text style={styles.tripMetaText}>{`${endTime.diff(
                          startTime,
                          "minutes"
                        )} min`}</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.viewTripButton}
                    onPress={() =>
                      router.push({
                        pathname: "/(home)/trip-details",
                        params: {
                          tripId: schedule.id,
                          tripName: schedule.name,
                          isAssigned: "false",
                        },
                      })
                    }
                  >
                    <Text style={styles.viewTripButtonText}>
                      View Trip Details
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="#082640" />
                  </TouchableOpacity>
                </View>
              );
            })()
          ) : (
            <EmptyState
              icon="alarm-outline"
              text="No assigned trips for today."
              subtext="Clock in to start tracking your time"
            />
          )}
        </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationContainer: {
    marginRight: 15,
    position: "relative",
  },
  bellBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#F44336",
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    zIndex: 2,
  },
  notificationCount: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
    lineHeight: 13,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileOuterBorder: {
    borderWidth: 1,
    borderColor: "#082640",
    borderRadius: 25,
    padding: 1,
  },
  profileInnerBorder: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 23,
    overflow: "hidden",
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
  todaysTripContainer: {
    marginBottom: 20,
  },
  todaysTripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  todaysTripTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAllText: {
    fontSize: 14,
    color: "#082640",
  },
  tripCard: {
    backgroundColor: "#f8fbff",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0eaf9",
  },
  tripHeader: {
    marginBottom: 10,
  },
  tripName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  tripTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripTimeText: {
    fontSize: 14,
    marginLeft: 5,
    color: "#082640",
    fontWeight: "500",
  },
  tripStops: {
    marginBottom: 10,
  },
  tripStop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#082640",
    marginRight: 8,
  },
  stopName: {
    fontSize: 14,
  },
  tripMeta: {
    flexDirection: "row",
    marginBottom: 15,
  },
  tripMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  tripMetaText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  viewTripButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0eaf9",
  },
  viewTripButtonText: {
    fontSize: 14,
    color: "#082640",
    fontWeight: "500",
    marginRight: 5,
  },
  tripOverviewContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  tripOverviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  tripOverviewTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  dropdownText: {
    fontSize: 14,
    marginRight: 5,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  checkInDot: {
    backgroundColor: "#082640",
  },
  checkOutDot: {
    backgroundColor: "#ccc",
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  errorContainer: {
    padding: 16,
    alignItems: "center",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    textAlign: "center",
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
