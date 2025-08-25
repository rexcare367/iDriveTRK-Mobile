import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BottomTabBar from "../../components/BottomTabBar";
import DateSelector from "../../components/DateSelector";
import SubmitButton from "../../components/SubmitButton";
import {
  generateTimesheetFromClockData,
  submitTimesheet,
} from "../../redux/actions/timesheetActions";

interface Timesheet {
  id?: string;
  period: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  overtimeHours: number;
  entries: any[];
  note?: string;
}

export default function SubmitTimeSheetScreen() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.user);
  const { clockEntries, loading } = useSelector(
    (state: any) => state.timesheet
  );

  const [periodType, setPeriodType] = useState("Weekly");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedWeek, setSelectedWeek] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [note, setNote] = useState("");
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);

  useEffect(() => {
    generateTimesheet();
  }, [periodType, selectedDate, selectedWeek, selectedMonth, clockEntries]);

  const generateTimesheet = () => {
    let startDate: string, endDate: string;

    if (periodType === "Daily") {
      startDate = selectedDate;
      endDate = selectedDate;
    } else if (periodType === "Weekly") {
      const date = new Date(selectedWeek);
      const day = date.getDay(); // 0-6
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);

      const weekStart = new Date(date);
      weekStart.setDate(diff);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      startDate = weekStart.toISOString().split("T")[0];
      endDate = weekEnd.toISOString().split("T")[0];
    } else if (periodType === "Monthly") {
      const date = new Date(selectedMonth);
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      startDate = firstDay.toISOString().split("T")[0];
      endDate = lastDay.toISOString().split("T")[0];
    } else {
      startDate = selectedDate;
      endDate = selectedDate;
    }

    const generatedTimesheet = dispatch(
      generateTimesheetFromClockData(
        clockEntries,
        periodType.toUpperCase(),
        startDate,
        endDate,
        currentUser.id,
        currentUser.name
      ) as any
    );

    setTimesheet(generatedTimesheet);
  };

  const handleSubmit = async () => {
    if (!timesheet) {
      Alert.alert("Error", "No timesheet data to submit");
      return;
    }

    try {
      dispatch(
        submitTimesheet({
          ...timesheet,
          note,
        }) as any
      );

      Alert.alert("Success", "Timesheet submitted successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to submit timesheet");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back-outline" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Submit Time Sheet</Text>
          <View style={styles.placeholder} />
        </View>

        <DateSelector
          periodType={periodType}
          onPeriodChange={setPeriodType}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          selectedWeek={selectedWeek}
          onWeekChange={setSelectedWeek}
        />

        <View style={styles.noteContainer}>
          <Text style={styles.noteLabel}>Note</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Type the description here"
            multiline
            value={note}
            onChangeText={setNote}
          />
        </View>

        {timesheet && timesheet.totalHours === 0 && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              No clock entries found for the selected period. Your timesheet
              will be submitted with 0 hours.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <SubmitButton
          title="Submit"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
        />
      </View>
      <BottomTabBar activeTab={"TimeSheet"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 30,
    paddingBottom: 30,
  },
  backButton: {
    padding: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  noteContainer: {
    marginBottom: 20,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
  },
  warningContainer: {
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  warningText: {
    color: "#856404",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
});
