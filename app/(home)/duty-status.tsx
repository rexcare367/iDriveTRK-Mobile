import BottomTabBar from "@/components/BottomTabBar";
import { goOffDuty, goOnDuty } from "@/redux/actions/driverActions";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const DutyStatusScreen = () => {
  const params = useLocalSearchParams();

  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);

  const { tripName } = params;

  const {
    isClockedIn,
    isOffDuty,
    offDutyStartTime,
    clockInTime,
    selectedTrip,
  } = useSelector((state: any) => state.driver);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeDisplay, setTimeDisplay] = useState("");
  const [offDutyDuration, setOffDutyDuration] = useState(0);
  const [workDuration, setWorkDuration] = useState(0);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setTimeDisplay(formatTime(now));
      if (isOffDuty && offDutyStartTime) {
        const offDutyStart = new Date(offDutyStartTime);
        const offDutyDurationMs = now - offDutyStart;
        setOffDutyDuration(Math.floor(offDutyDurationMs / 60000));
      }
      if (isClockedIn && clockInTime) {
        const clockInTimeDate = new Date(clockInTime);
        const workDurationMs = now - clockInTimeDate;
        setWorkDuration(Math.floor(workDurationMs / 60000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isOffDuty, offDutyStartTime, isClockedIn, clockInTime]);

  const formatTime = (date: any) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr}${ampm}`;
  };

  const formatDate = (date: any) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";

    return `${dayName} ${day}${suffix} ${month}, ${year}`;
  };

  const formatDuration = (minutes: any) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleBack = () => {
    router.back();
  };

  const handleDutyAction = (type: any) => {
    setActionType(type);
    setConfirmModalVisible(true);
  };

  const confirmDutyAction = () => {
    if (actionType === "offDuty") {
      dispatch(goOffDuty());
    } else if (actionType === "onDuty") {
      dispatch(goOnDuty());
      if (selectedTrip && selectedTrip.period === "AM") {
        router.push({
          pathname: "/trip-stops",
          params: {
            tripId: null,
            tripName: tripName.replace("AM", "PM"),
          },
        });
      }
    }
    setConfirmModalVisible(false);
  };

  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Duty Status</Text>
        <Image
          source={
            user?.avatar
              ? { uri: user.avatar }
              : require("@/assets/profile-placeholder.png")
          }
          style={styles.profileImage}
        />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.greeting}>Hello,</Text>
        <Text style={styles.name}>
          {firstName} {lastName}!
        </Text>

        <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
        <Text style={styles.timeText}>{timeDisplay}</Text>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIndicator}>
              <View
                style={[
                  styles.statusDot,
                  isOffDuty ? styles.offDutyStatusDot : styles.onDutyStatusDot,
                ]}
              />
              <Text style={styles.statusText}>
                {isOffDuty ? "Off Duty" : "On Duty"}
              </Text>
            </View>
            <Text style={styles.durationText}>
              {isOffDuty
                ? `Off Duty: ${formatDuration(offDutyDuration)}`
                : `Working: ${formatDuration(workDuration)}`}
            </Text>
          </View>

          <View style={styles.statusDetails}>
            <View style={styles.statusDetail}>
              <Text style={styles.statusDetailLabel}>Current Status</Text>
              <Text
                style={[
                  styles.statusDetailValue,
                  isOffDuty ? styles.offDutyText : styles.onDutyText,
                ]}
              >
                {isOffDuty ? "Off Duty" : "On Duty"}
              </Text>
            </View>

            <View style={styles.statusDetailDivider} />

            <View style={styles.statusDetail}>
              <Text style={styles.statusDetailLabel}>
                {isOffDuty ? "Off Duty Since" : "On Duty Since"}
              </Text>
              <Text style={styles.statusDetailValue}>
                {isOffDuty
                  ? formatTime(new Date(offDutyStartTime))
                  : formatTime(new Date(clockInTime))}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtonsContainer}>
          {isOffDuty ? (
            <TouchableOpacity
              style={styles.onDutyButton}
              onPress={() => handleDutyAction("onDuty")}
            >
              <Ionicons name="play-circle-outline" size={24} color="white" />
              <Text style={styles.actionButtonText}>Go On Duty</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.offDutyButton}
              onPress={() => handleDutyAction("offDuty")}
            >
              <Ionicons name="pause-circle-outline" size={24} color="white" />
              <Text style={styles.actionButtonText}>Go Off Duty</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Duty Status Information</Text>
          <View style={styles.infoItem}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#082640"
            />
            <Text style={styles.infoText}>
              Use "Go Off Duty" when you complete your AM trip and are taking a
              break before your PM trip.
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#082640"
            />
            <Text style={styles.infoText}>
              Use "Go On Duty" when you're ready to start your PM trip after
              your break.
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#082640"
            />
            <Text style={styles.infoText}>
              Your off-duty time will be recorded for accurate timesheet
              calculations.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {actionType === "offDuty" ? "Go Off Duty" : "Go On Duty"}
            </Text>
            <Text style={styles.modalText}>
              {actionType === "offDuty"
                ? "You are about to go off duty. This will mark the end of your AM trip. Your work time will be paused until you go back on duty."
                : "You are about to go back on duty. This will mark the start of your PM trip."}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  actionType === "offDuty"
                    ? styles.modalOffDutyButton
                    : styles.modalOnDutyButton,
                ]}
                onPress={confirmDutyAction}
              >
                <Text style={styles.modalConfirmButtonText}>
                  {actionType === "offDuty" ? "Go Off Duty" : "Go On Duty"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomTabBar activeTab="Home" />
    </SafeAreaView>
  );
};

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
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  dateText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  timeText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#082640",
    textAlign: "center",
    marginBottom: 30,
  },
  statusCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusHeader: {
    marginBottom: 15,
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
  onDutyStatusDot: {
    backgroundColor: "#4CAF50",
  },
  offDutyStatusDot: {
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
  statusDetails: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  statusDetail: {
    flex: 1,
  },
  statusDetailLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  statusDetailValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  onDutyText: {
    color: "#4CAF50",
  },
  offDutyText: {
    color: "#FFC107",
  },
  statusDetailDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#eee",
    marginHorizontal: 15,
  },
  actionButtonsContainer: {
    marginBottom: 20,
  },
  onDutyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 10,
  },
  offDutyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC107",
    paddingVertical: 15,
    borderRadius: 10,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    marginLeft: 10,
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
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalCancelButton: {
    backgroundColor: "#f0f0f0",
  },
  modalOffDutyButton: {
    backgroundColor: "#FFC107",
  },
  modalOnDutyButton: {
    backgroundColor: "#4CAF50",
  },
  modalCancelButtonText: {
    color: "#666",
  },
  modalConfirmButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default DutyStatusScreen;
