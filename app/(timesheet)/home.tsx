import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../../components/EmptyState";
import StatCard from "../../components/StatCard";
import SubmitButton from "../../components/SubmitButton";
import DateSection from "../../feature/timesheets/DateSection";
import { submitForApproval } from "../../redux/actions/timesheetActions";
import { ITruck, IUser } from "../../redux/types";
import api from "../../utils/apiClient";

// Type definitions
export interface IBreak {
  id: string;
  start: string;
  end: string;
}

export interface ISchedule {
  asignee: string;
  color: string;
  created_at: string;
  description: string;
  end_time: string;
  id: string;
  job_id: string;
  scheduler_id: string;
  start_time: string;
  status: string;
  stops: any[];
  title: string;
  type: string;
}

export interface ITimesheet {
  id: string;
  clockin_time: string;
  clockout_time: string;
  breaks: IBreak[];
  created_at: string;
  updated_at: string;
  is_submitted: boolean;
  status: string;
  schedule: ISchedule;
  truck: ITruck;
  user: IUser;
}

export default function TimeSheetHomeScreen() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.user);
  const { user } = useSelector((state: any) => state.auth);

  // Local state for timesheet data
  const [clockEntries, setClockEntries] = useState<ITimesheet[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ITimesheet | null>(null);
  const [editClockIn, setEditClockIn] = useState("");
  const [editClockOut, setEditClockOut] = useState("");
  const [editBreaks, setEditBreaks] = useState<IBreak[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState(new Set<string>());
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [approvalReason, setApprovalReason] = useState("");
  const [editedEntries, setEditedEntries] = useState(new Set<string>());

  useEffect(() => {
    const fetchTimesheets = async () => {
      setLoading(true);
      setError(null);
      if (!user?.id) return;

      try {
        // Get current date range (current month) using moment
        const startOfMonth = moment().startOf("month");
        const endOfMonth = moment().add(1, "year").endOf("month");

        const startTime = startOfMonth.format("YYYY-MM-DD");
        const endTime = endOfMonth.format("YYYY-MM-DD");

        // Fetch timesheets from backend
        const response = await api.get(
          `/api/timesheets/by-user/${user?.id || "1"}`,
          {
            params: {
              start_time: startTime,
              end_time: endTime,
              is_submitted: false,
            },
          }
        );

        if (response.data) {
          // Update local state with fetched data
          setClockEntries(response.data);
        }
      } catch (error: any) {
        console.error("Error fetching timesheets:", error);
        setError(error.message || "Failed to fetch timesheet data");

        // Show error alert to user
        Alert.alert(
          "Connection Error",
          "Unable to fetch timesheet data. Please try again later.",
          [{ text: "OK" }]
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTimesheets();
  }, [user?.id]);

  // Function to refetch data (for retry button)
  const refetchTimesheets = async () => {
    setLoading(true);
    setError(null);
    if (!user?.id) return;

    try {
      const startOfMonth = moment().startOf("month");
      const endOfMonth = moment().endOf("month");

      const startTime = startOfMonth.format("YYYY-MM-DD");
      const endTime = endOfMonth.format("YYYY-MM-DD");

      const response = await api.get(
        `/api/timesheets/by-user/${user?.id || "1"}`,
        {
          params: {
            start_time: startTime,
            end_time: endTime,
          },
        }
      );

      if (response.data) {
        setClockEntries(response.data || []);
      }
    } catch (error: any) {
      console.error("Error fetching timesheets:", error);
      setError(error.message || "Failed to fetch timesheet data");
    } finally {
      setLoading(false);
    }
  };

  const handleEditEntry = (entry: ITimesheet) => {
    console.log("entry", entry);
    // setEditingEntry(entry);
    // setEditClockIn(entry.clockin_time);
    // setEditClockOut(entry.clockout_time);
    // setEditBreaks(entry.breaks.map((b) => ({ ...b })));
    // setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editingEntry || !editClockIn || !editClockOut) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const updatedEntry: ITimesheet = {
      ...editingEntry,
      clockin_time: editClockIn,
      clockout_time: editClockOut,
      breaks: editBreaks,
      updated_at: moment().toISOString(),
      status: "pending_approval",
    };

    setClockEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
    setEditedEntries((prev) => new Set([...prev, updatedEntry.id]));
    setEditModalVisible(false);
    setEditingEntry(null);
    setEditClockIn("");
    setEditClockOut("");
    setEditBreaks([]);

    setApprovalModalVisible(true);
  };

  const handleSubmitForApproval = () => {
    if (!approvalReason.trim()) {
      Alert.alert("Error", "Please provide a reason for the changes");
      return;
    }

    const approvalData = {
      entryId: editingEntry?.id,
      reason: approvalReason,
      submittedBy: currentUser?.id || "1",
      submittedAt: moment().toISOString(),
      status: "pending_approval",
    };

    dispatch(submitForApproval(approvalData) as any);
    setPendingApprovals((prev) => new Set([...prev, editingEntry?.id || ""]));
    setApprovalModalVisible(false);
    setApprovalReason("");

    Alert.alert(
      "Submitted for Approval",
      "Your timesheet changes have been submitted to your manager for approval.",
      [{ text: "OK" }]
    );
  };

  // const handleAddMissingEntry = (date: string, type: string) => {
  //   const newEntry: ClockEntry = {
  //     id: Date.now().toString(),
  //     type: type,
  //   };

  //   setEditingEntry(newEntry);
  //   setEditDate(moment(date).format("YYYY-MM-DD"));
  //   setEditTime("09:00");
  //   setEditModalVisible(true);
  // };

  const handleSubmitTimesheet = () => {
    Alert.alert(
      "Submit Timesheet",
      "Are you sure you want to submit your timesheet?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: async () => {
            try {
              // Only submit timesheets that are not already submitted
              const timesheetIds = clockEntries.map((entry) => entry.id);

              if (timesheetIds.length === 0) {
                Alert.alert("Info", "No unsubmitted timesheets to submit.");
                return;
              }

              // Call the backend API with PATCH
              await api.patch("api/timesheets/", {
                ids: timesheetIds,
                is_submitted: true,
              });

              Alert.alert("Success", "Timesheet submitted successfully!");
              // Refresh timesheet data
              refetchTimesheets();
            } catch (error) {
              Alert.alert("Error", "Failed to submit timesheet.");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <StatCard
            title="Total Hours Worked"
            value={`${totalHours}hrs`}
            iconName="alarm-outline"
            backgroundColor="#002B49"
          />
          <StatCard
            title="Over Time Worked"
            value={`${overtimeHours}hrs`}
            iconName="trending-up"
            backgroundColor="#f5f5f5"
            textColor="#333"
          />
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for Activity"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={refetchTimesheets}
            disabled={loading}
          >
            <Ionicons
              name="refresh"
              size={20}
              color={loading ? "#ccc" : "#666"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.calendarButton}>
            <Ionicons name="calendar" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.timelineContainer}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#002B49" />
              <Text style={styles.loadingText}>Loading timesheets...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#FF9800" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={refetchTimesheets}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : clockEntries.length === 0 ? (
            <EmptyState
              icon="alarm-outline"
              text="No timesheet to submit"
              subtext="Clock in to start tracking your time"
            />
          ) : (
            clockEntries.map((entry, index) => {
              return (
                <DateSection
                  key={index}
                  date={entry.updated_at}
                  dayData={entry}
                  onEditEntry={handleEditEntry}
                  // onAddMissingEntry={handleAddMissingEntry}
                />
              );
            })
          )}
        </ScrollView>

        <View style={styles.actionsContainer}>
          <SubmitButton
            title="Submit time sheet"
            onPress={handleSubmitTimesheet}
          />
        </View>
      </View>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Timesheet</Text>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close-circle-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Clock In Time</Text>
                <TextInput
                  style={styles.input}
                  value={editClockIn}
                  onChangeText={setEditClockIn}
                  placeholder="YYYY-MM-DDTHH:mm:ss.sssZ"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Clock Out Time</Text>
                <TextInput
                  style={styles.input}
                  value={editClockOut}
                  onChangeText={setEditClockOut}
                  placeholder="YYYY-MM-DDTHH:mm:ss.sssZ"
                />
              </View>
              <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                Breaks
              </Text>
              {editBreaks.map((br, idx) => (
                <View key={br.id || idx} style={{ marginBottom: 12 }}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Break Start</Text>
                    <TextInput
                      style={styles.input}
                      value={br.start}
                      onChangeText={(val) => {
                        setEditBreaks((breaks) =>
                          breaks.map((b, i) =>
                            i === idx ? { ...b, start: val } : b
                          )
                        );
                      }}
                      placeholder="YYYY-MM-DDTHH:mm:ss.sssZ"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Break End</Text>
                    <TextInput
                      style={styles.input}
                      value={br.end}
                      onChangeText={(val) => {
                        setEditBreaks((breaks) =>
                          breaks.map((b, i) =>
                            i === idx ? { ...b, end: val } : b
                          )
                        );
                      }}
                      placeholder="YYYY-MM-DDTHH:mm:ss.sssZ"
                    />
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* approval Modal */}
      <Modal
        visible={approvalModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setApprovalModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit for Approval</Text>
              <TouchableOpacity
                onPress={() => setApprovalModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close-circle-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.approvalDescription}>
                Your timesheet changes will be sent to your manager for
                approval. Please provide a reason for the changes.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Reason for Changes *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={approvalReason}
                  onChangeText={setApprovalReason}
                  placeholder="e.g., Forgot to clock out, Incorrect time entry..."
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setApprovalModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitApprovalButton}
                onPress={handleSubmitForApproval}
              >
                <Ionicons
                  name="send"
                  size={16}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.submitApprovalButtonText}>
                  Submit for Approval
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: "#333",
  },
  calendarButton: {
    padding: 8,
  },
  timelineContainer: {
    marginBottom: 100,
  },
  actionsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f2f5",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  approvalDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  submitApprovalButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#FF9800",
  },
  submitApprovalButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 64,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 64,
  },
  errorText: {
    fontSize: 16,
    color: "#FF9800",
    marginTop: 16,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#002B49",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  refreshButton: {
    padding: 8,
  },
});
