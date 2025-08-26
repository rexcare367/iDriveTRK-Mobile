import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import moment from "moment";
import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useSelector } from "react-redux";

import checkAnimation from "../../assets/lottie/check.json";
import BackgroundEffects from "../../components/BackgroundEffects";
import { api } from "../../utils";

interface LeaveTypeIcon {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface LeaveTypeIcons {
  [key: string]: LeaveTypeIcon;
}

export default function NewPTORequestScreen() {
  const params = useLocalSearchParams();
  const leaveType = (params?.leaveType as string) || "PTO";
  const [description, setDescription] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const today = moment();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startTime, setStartTime] = useState(
    moment().add(1, "hour").set({ minute: 0, second: 0, millisecond: 0 })
  );
  const [endTime, setEndTime] = useState(
    moment().add(2, "hour").set({ minute: 0, second: 0, millisecond: 0 })
  );
  const [pickerMode, setPickerMode] = useState<string | null>(null); // 'start' or 'end'
  const [pickerType, setPickerType] = useState<string | null>(null); // 'date' or 'time'
  const [tempDate, setTempDate] = useState<moment.Moment | null>(null);
  const { user } = useSelector((state: any) => state.auth);

  const handleSubmit = async () => {
    if (!startTime || !endTime) {
      Alert.alert("Missing Fields", "Please select both start and end time.");
      return;
    }
    if (!description.trim()) {
      Alert.alert(
        "Missing Description",
        "Please enter a reason for your leave."
      );
      return;
    }
    if (!user?.id) {
      Alert.alert(
        "User Error",
        "User information is missing. Please re-login."
      );
      return;
    }
    try {
      // Calculate duration in hours (rounded to 2 decimals)
      const durationMs = endTime.diff(startTime);
      if (durationMs <= 0) {
        Alert.alert("Invalid Time Range", "End time must be after start time.");
        return;
      }
      const duration = Math.round((durationMs / (1000 * 60 * 60)) * 100) / 100;
      const payload = {
        type: leaveType,
        description,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration,
        created_by: user.id,
        status: "pending",
        assigned_id: user.id,
      };
      await api.post("/api/pto", payload);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to submit PTO request:", error);
      Alert.alert(
        "Submission Failed",
        "Could not submit PTO request. Please try again."
      );
    }
  };

  const handleContinue = () => {
    setShowSuccessModal(false);
    router.push("/(pto)/pto");
  };

  const leaveTypeIcons: LeaveTypeIcons = {
    PTO: { icon: "briefcase-outline", color: "#1976D2" },
    "Holiday Pay": { icon: "calendar-outline", color: "#43A047" },
    "Sick Leave": { icon: "medkit-outline", color: "#E53935" },
    "Non paid Absence": { icon: "remove-circle-outline", color: "#757575" },
  };

  const getDatesInRange = (
    start: moment.Moment | null,
    end: moment.Moment | null
  ) => {
    const dates: { [key: string]: any } = {};
    if (!start || !end) return dates;
    let current = moment(start);
    const last = moment(end);
    while (current.isSameOrBefore(last, "day")) {
      const dateStr = current.format("YYYY-MM-DD");
      dates[dateStr] = {
        selected: true,
        selectedColor: "#e0eaff",
        ...(dateStr === moment(start).format("YYYY-MM-DD") && {
          startingDay: true,
          color: "#1976D2",
          textColor: "#fff",
        }),
        ...(dateStr === moment(end).format("YYYY-MM-DD") && {
          endingDay: true,
          color: "#1976D2",
          textColor: "#fff",
        }),
      };
      current.add(1, "day");
    }
    return dates;
  };

  return (
    <View style={styles.container}>
      <BackgroundEffects />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} />
        </TouchableOpacity>
        <View style={styles.typeBadge}>
          <Ionicons
            name={leaveTypeIcons[leaveType]?.icon || "help-circle-outline"}
            size={22}
            color={leaveTypeIcons[leaveType]?.color || "#1976D2"}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.typeBadgeText,
              { color: leaveTypeIcons[leaveType]?.color || "#1976D2" },
            ]}
          >
            {leaveType}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Request {leaveType}</Text>

        <View style={styles.calendarContainer}>
          <Calendar
            current={today.format("YYYY-MM-DD")}
            onDayPress={(day) => {
              // handle day selection if needed
              // e.g., setSelectedDates([new Date(day.dateString)])
            }}
            markedDates={getDatesInRange(startTime, endTime)}
            theme={{
              todayTextColor: "#082640",
              selectedDayBackgroundColor: "#e0eaff",
              selectedDayTextColor: "#082640",
              arrowColor: "#082640",
            }}
          />
        </View>

        <Text style={styles.inputLabel}>Start Time</Text>
        <TouchableOpacity
          onPress={() => {
            setPickerMode("start");
            setPickerType("date");
            setShowStartPicker(true);
          }}
          style={styles.dateInput}
        >
          <Text style={styles.dateText}>
            {startTime
              ? `${startTime.format("L")} ${startTime.format("LT")}`
              : "Select Start Date & Time"}
          </Text>
        </TouchableOpacity>
        {showStartPicker && pickerMode === "start" && pickerType === "date" && (
          <DateTimePicker
            value={startTime ? startTime.toDate() : moment().toDate()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (event.type === "set" && selectedDate) {
                setTempDate(moment(selectedDate));
                setPickerType("time");
              } else {
                setShowStartPicker(false);
                setPickerType(null);
                setTempDate(null);
              }
            }}
          />
        )}
        {showStartPicker && pickerMode === "start" && pickerType === "time" && (
          <DateTimePicker
            value={startTime ? startTime.toDate() : moment().toDate()}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={(event, selectedTime) => {
              setShowStartPicker(false);
              setPickerType(null);
              if (event.type === "set" && selectedTime && tempDate) {
                const combined = moment(tempDate).set({
                  hour: moment(selectedTime).hour(),
                  minute: 0, // Always set minute to zero
                  second: 0,
                  millisecond: 0,
                });
                setStartTime(combined);
              }
              setTempDate(null);
            }}
          />
        )}
        <Text style={styles.inputLabel}>End Time</Text>
        <TouchableOpacity
          onPress={() => {
            setPickerMode("end");
            setPickerType("date");
            setShowEndPicker(true);
          }}
          style={styles.dateInput}
        >
          <Text style={styles.dateText}>
            {endTime
              ? `${endTime.format("L")} ${endTime.format("LT")}`
              : "Select End Date & Time"}
          </Text>
        </TouchableOpacity>
        {showEndPicker && pickerMode === "end" && pickerType === "date" && (
          <DateTimePicker
            value={endTime ? endTime.toDate() : moment().toDate()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (event.type === "set" && selectedDate) {
                setTempDate(moment(selectedDate));
                setPickerType("time");
              } else {
                setShowEndPicker(false);
                setPickerType(null);
                setTempDate(null);
              }
            }}
          />
        )}
        {showEndPicker && pickerMode === "end" && pickerType === "time" && (
          <DateTimePicker
            value={endTime ? endTime.toDate() : moment().toDate()}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={(event, selectedTime) => {
              setShowEndPicker(false);
              setPickerType(null);
              if (event.type === "set" && selectedTime && tempDate) {
                const combined = moment(tempDate).set({
                  hour: moment(selectedTime).hour(),
                  minute: 0, // Always set minute to zero
                  second: 0,
                  millisecond: 0,
                });
                setEndTime(combined);
              }
              setTempDate(null);
            }}
          />
        )}

        <Text style={styles.inputLabel}>Reason (Description)</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Type the description here"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Select for Approval</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showSuccessModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LottieView
              source={checkAnimation}
              autoPlay
              loop={false}
              style={{ width: 164, height: 164 }}
            />
            <Text style={styles.modalTitle}>Successfully Submitted</Text>
            <Text style={styles.modalText}>
              Congratulations you have successfully Submitted your {leaveType}{" "}
              request
            </Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCount: {
    color: "white",
    fontSize: 12,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 15,
  },
  dropdown: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownMenu: {
    position: "absolute",
    top: 160,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 5,
    elevation: 3,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 100,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateColumn: {
    width: "48%",
  },
  dateInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
  },
  dateText: {
    fontSize: 16,
  },
  calendarContainer: {
    marginTop: 15,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  calendarMonth: {
    fontSize: 16,
    fontWeight: "600",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  calendarDay: {
    width: "14.28%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 10,
    fontSize: 14,
  },
  startCalendarDay: {
    backgroundColor: "#082640",
    borderRadius: 20,
    overflow: "hidden",
  },
  endCalendarDay: {
    backgroundColor: "#082640",
    borderRadius: 20,
    overflow: "hidden",
  },
  selectedCalendarDay: {
    backgroundColor: "#e0eaff",
    borderRadius: 20,
    overflow: "hidden",
  },
  descriptionInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#082640",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    shadowColor: "#082640",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: 400,
    letterSpacing: 1,
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
    alignItems: "center",
  },
  successIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: "#082640",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: "100%",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  backButton: {
    marginRight: 10,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f0fc",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: "center",
  },
  typeBadgeText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  daysSelectedLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 18,
    marginBottom: 10,
    color: "#082640",
    textAlign: "center",
  },
});
