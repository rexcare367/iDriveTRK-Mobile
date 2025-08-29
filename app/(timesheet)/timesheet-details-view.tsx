import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import BottomTabBar from "../../components/BottomTabBar";

interface TimesheetEntry {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string;
  hours: number;
  type: string;
}

interface Timesheet {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  status: string;
  totalHours: number;
  overtimeHours: number;
  entries: TimesheetEntry[];
  submittedAt: string;
  note?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export default function TimeSheetDetailsScreen() {
  const params = useLocalSearchParams();
  const timesheetId = params.timesheetId as string;
  const { timesheets } = useSelector((state: any) => state.timesheet);

  const timesheet: Timesheet = timesheets.find(
    (t: Timesheet) => t.id === timesheetId
  ) || {
    id: "1",
    period: "WEEKLY",
    startDate: "2025-04-15",
    endDate: "2025-04-21",
    status: "PENDING",
    totalHours: 42,
    overtimeHours: 2,
    entries: [
      {
        id: "101",
        date: "2025-04-18",
        clockIn: "08:00",
        clockOut: "17:00",
        hours: 8,
        type: "REGULAR",
      },
      {
        id: "102",
        date: "2025-04-19",
        clockIn: "08:00",
        clockOut: "18:00",
        hours: 9,
        type: "OVERTIME",
      },
      {
        id: "103",
        date: "2025-04-21",
        clockIn: "08:00",
        clockOut: "17:00",
        hours: 8,
        type: "REGULAR",
      },
    ],
    submittedAt: "2025-04-21T18:30:00Z",
    note: "Regular week with some overtime on Friday",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "#28a745";
      case "REJECTED":
        return "#dc3545";
      case "PENDING":
      default:
        return "#ffc107";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.periodContainer}>
            <Text style={styles.periodLabel}>Period</Text>
            <Text style={styles.periodValue}>{timesheet.period}</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(timesheet.status) },
            ]}
          >
            <Text style={styles.statusText}>{timesheet.status}</Text>
          </View>
        </View>

        <View style={styles.dateRangeContainer}>
          <Text style={styles.dateRangeLabel}>Date Range</Text>
          <Text style={styles.dateRangeValue}>
            {formatDate(timesheet.startDate)} - {formatDate(timesheet.endDate)}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Hours</Text>
            <Text style={styles.statValue}>{timesheet.totalHours}hrs</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Overtime</Text>
            <Text style={styles.statValue}>{timesheet.overtimeHours}hrs</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Regular</Text>
            <Text style={styles.statValue}>
              {timesheet.totalHours - timesheet.overtimeHours}hrs
            </Text>
          </View>
        </View>

        <View style={styles.entriesContainer}>
          <Text style={styles.sectionTitle}>Time Entries</Text>

          {timesheet.entries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                <View
                  style={[
                    styles.entryTypeBadge,
                    {
                      backgroundColor:
                        entry.type === "OVERTIME" ? "#ffc107" : "#28a745",
                    },
                  ]}
                >
                  <Text style={styles.entryTypeText}>{entry.type}</Text>
                </View>
              </View>

              <View style={styles.entryDetails}>
                <View style={styles.entryTime}>
                  <Ionicons
                    name="alarm-outline"
                    size={16}
                    color="#666"
                    style={styles.entryIcon}
                  />
                  <Text style={styles.entryTimeText}>
                    {formatTime(entry.clockIn)} - {formatTime(entry.clockOut)}
                  </Text>
                </View>

                <View style={styles.entryHours}>
                  <Ionicons
                    name="watch"
                    size={16}
                    color="#666"
                    style={styles.entryIcon}
                  />
                  <Text style={styles.entryHoursText}>{entry.hours} hours</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {timesheet.note && (
          <View style={styles.noteContainer}>
            <Text style={styles.sectionTitle}>Note</Text>
            <View style={styles.noteCard}>
              <Text style={styles.noteText}>{timesheet.note}</Text>
            </View>
          </View>
        )}

        <View style={styles.submissionInfoContainer}>
          <Text style={styles.sectionTitle}>Submission Info</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Submitted At</Text>
              <Text style={styles.infoValue}>
                {new Date(timesheet.submittedAt).toLocaleString()}
              </Text>
            </View>

            {timesheet.approvedAt && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Approved At</Text>
                <Text style={styles.infoValue}>
                  {new Date(timesheet.approvedAt).toLocaleString()}
                </Text>
              </View>
            )}

            {timesheet.rejectedAt && (
              <>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Rejected At</Text>
                  <Text style={styles.infoValue}>
                    {new Date(timesheet.rejectedAt).toLocaleString()}
                  </Text>
                </View>

                {timesheet.rejectionReason && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Rejection Reason</Text>
                    <Text style={styles.infoValue}>
                      {timesheet.rejectionReason}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>
      <BottomTabBar activeTab={"TimeSheet"} />
    </SafeAreaView>
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
  },
  backButton: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  periodContainer: {
    flex: 1,
  },
  periodLabel: {
    fontSize: 14,
    color: "#666",
  },
  periodValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 12,
  },
  dateRangeContainer: {
    marginBottom: 16,
  },
  dateRangeLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  dateRangeValue: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  entriesContainer: {
    marginBottom: 24,
  },
  entryCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: "500",
  },
  entryTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  entryTypeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "500",
  },
  entryDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  entryTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  entryHours: {
    flexDirection: "row",
    alignItems: "center",
  },
  entryIcon: {
    marginRight: 4,
  },
  entryTimeText: {
    fontSize: 14,
    color: "#333",
  },
  entryHoursText: {
    fontSize: 14,
    color: "#333",
  },
  noteContainer: {
    marginBottom: 24,
  },
  noteCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
  },
  noteText: {
    fontSize: 14,
    color: "#333",
  },
  submissionInfoContainer: {
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
  },
});
