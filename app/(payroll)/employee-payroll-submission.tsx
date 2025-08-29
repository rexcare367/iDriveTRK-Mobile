import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  calculatePayrollPeriod,
  fetchPayrollHistory,
  submitPayrollRequest,
} from "../../redux/actions/payrollActions";

const { height: screenHeight } = Dimensions.get("window");

export default function PayrollSubmissionScreen() {
  const dispatch = useDispatch();
  // const { currentUser } = useSelector((state: any) => state.user);
  const { clockEntries } = useSelector((state: any) => state.timesheet);
  const { payrollPeriods, isSubmitting, payrollHistory } = useSelector(
    (state: any) => state.payroll
  );

  const [selectedPeriod, setSelectedPeriod] = useState<any>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (clockEntries && clockEntries.length > 0) {
      dispatch(calculatePayrollPeriod(clockEntries) as any);
    }
    dispatch(fetchPayrollHistory("1") as any); // Using default user ID
  }, [dispatch, clockEntries]);

  const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatHours = (hours: any) => {
    return `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`;
  };

  const calculateOvertimeHours = (regularHours: any) => {
    return Math.max(0, regularHours - 80); // 80 hours = 2 weeks * 40 hours
  };

  const calculateGrossPay = (
    regularHours: any,
    overtimeHours: any,
    hourlyRate = 25
  ) => {
    const regularPay = Math.min(regularHours, 80) * hourlyRate;
    const overtimePay = overtimeHours * (hourlyRate * 1.5);
    return regularPay + overtimePay;
  };

  const handleSubmitPayroll = (period: any) => {
    setSelectedPeriod(period);
    setConfirmModalVisible(true);
  };

  const confirmSubmission = () => {
    if (!selectedPeriod) return;

    const payrollData = {
      userId: "1",
      userName: "Stephen Obarido",
      periodStart: selectedPeriod.startDate,
      periodEnd: selectedPeriod.endDate,
      regularHours: selectedPeriod.totalHours,
      overtimeHours: calculateOvertimeHours(selectedPeriod.totalHours),
      grossPay: calculateGrossPay(
        selectedPeriod.totalHours,
        calculateOvertimeHours(selectedPeriod.totalHours)
      ),
      entries: selectedPeriod.entries,
      notes: notes,
      submittedAt: new Date().toISOString(),
      status: "pending_review",
    };

    dispatch(submitPayrollRequest(payrollData) as any)
      .then(() => {
        Alert.alert(
          "Payroll Submitted",
          "Your payroll request has been submitted to HR for processing.",
          [{ text: "OK", onPress: () => setConfirmModalVisible(false) }]
        );
      })
      .catch(() => {
        Alert.alert(
          "Error",
          "Failed to submit payroll request. Please try again."
        );
      });

    setConfirmModalVisible(false);
    setNotes("");
    setSelectedPeriod(null);
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "pending_review":
        return "#FF9800";
      case "approved":
        return "#4CAF50";
      case "processed":
        return "#2196F3";
      case "rejected":
        return "#F44336";
      default:
        return "#666";
    }
  };

  const getStatusText = (status: any) => {
    switch (status) {
      case "pending_review":
        return "Pending Review";
      case "approved":
        return "Approved";
      case "processed":
        return "Processed";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payroll Submission</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Pay Periods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Pay Periods</Text>
          <Text style={styles.sectionSubtitle}>
            Submit your timesheet for bi-weekly payroll processing
          </Text>

          {payrollPeriods && payrollPeriods.length > 0 ? (
            payrollPeriods.map((period: any, index: number) => {
              const overtimeHours = calculateOvertimeHours(period.totalHours);
              const grossPay = calculateGrossPay(
                period.totalHours,
                overtimeHours
              );
              const isSubmittable =
                period.totalHours > 0 && !period.isSubmitted;

              return (
                <View key={index} style={styles.periodCard}>
                  <View style={styles.periodHeader}>
                    <View style={styles.periodDates}>
                      <Text style={styles.periodTitle}>
                        Pay Period {index + 1}
                      </Text>
                      <Text style={styles.periodRange}>
                        {formatDate(period.startDate)} -{" "}
                        {formatDate(period.endDate)}
                      </Text>
                    </View>
                    {period.isSubmitted && (
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: "#4CAF50" },
                        ]}
                      >
                        <Text style={styles.statusBadgeText}>Submitted</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.periodStats}>
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Regular Hours:</Text>
                      <Text style={styles.statValue}>
                        {formatHours(Math.min(period.totalHours, 80))}
                      </Text>
                    </View>
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Overtime Hours:</Text>
                      <Text
                        style={[
                          styles.statValue,
                          { color: overtimeHours > 0 ? "#FF9800" : "#666" },
                        ]}
                      >
                        {formatHours(overtimeHours)}
                      </Text>
                    </View>
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Total Hours:</Text>
                      <Text style={[styles.statValue, styles.totalHours]}>
                        {formatHours(period.totalHours)}
                      </Text>
                    </View>
                    <View style={[styles.statRow, styles.grossPayRow]}>
                      <Text style={styles.grossPayLabel}>
                        Estimated Gross Pay:
                      </Text>
                      <Text style={styles.grossPayValue}>
                        ${grossPay.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.periodDetails}>
                    <Text style={styles.detailsTitle}>
                      Work Days: {period.workDays}
                    </Text>
                    <Text style={styles.detailsSubtitle}>
                      {period.entries.length} clock entries recorded
                    </Text>
                  </View>

                  {isSubmittable && (
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={() => handleSubmitPayroll(period)}
                    >
                      <Ionicons name="send" size={16} color="#fff" />
                      <Text style={styles.submitButtonText}>
                        Submit for Payroll
                      </Text>
                    </TouchableOpacity>
                  )}

                  {!isSubmittable && period.totalHours === 0 && (
                    <View style={styles.noHoursContainer}>
                      <Text style={styles.noHoursText}>
                        No hours recorded for this period
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.noPeriodsContainer}>
              <Ionicons name="calendar" size={48} color="#ccc" />
              <Text style={styles.noPeriodsText}>No pay periods available</Text>
              <Text style={styles.noPeriodsSubtext}>
                Clock in to start tracking hours for payroll
              </Text>
            </View>
          )}
        </View>

        {/* Payroll History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payroll History</Text>
          <Text style={styles.sectionSubtitle}>
            Previous payroll submissions and their status
          </Text>

          {payrollHistory && payrollHistory.length > 0 ? (
            payrollHistory.map((submission: any, index: number) => (
              <View key={submission.id || index} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <View style={styles.historyDates}>
                    <Text style={styles.historyTitle}>
                      {formatDate(submission.periodStart)} -{" "}
                      {formatDate(submission.periodEnd)}
                    </Text>
                    <Text style={styles.historySubmitted}>
                      Submitted {formatDate(submission.submittedAt)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(submission.status) },
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>
                      {getStatusText(submission.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.historyStats}>
                  <View style={styles.historyStatItem}>
                    <Text style={styles.historyStatLabel}>Total Hours</Text>
                    <Text style={styles.historyStatValue}>
                      {formatHours(
                        submission.regularHours + submission.overtimeHours
                      )}
                    </Text>
                  </View>
                  <View style={styles.historyStatItem}>
                    <Text style={styles.historyStatLabel}>Gross Pay</Text>
                    <Text style={styles.historyStatValue}>
                      ${submission.grossPay.toFixed(2)}
                    </Text>
                  </View>
                </View>

                {submission.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText}>{submission.notes}</Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.noHistoryContainer}>
              <Ionicons name="document-text-outline" size={32} color="#ccc" />
              <Text style={styles.noHistoryText}>No payroll history</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Confirmation Modal - FIXED VERSION */}
      <Modal
        visible={confirmModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Confirm Payroll Submission
                </Text>
                <TouchableOpacity
                  onPress={() => setConfirmModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalScrollView}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {selectedPeriod && (
                  <View style={styles.modalBody}>
                    <View style={styles.confirmationDetails}>
                      <Text style={styles.confirmationTitle}>
                        Pay Period Summary
                      </Text>
                      <View style={styles.confirmationRow}>
                        <Text style={styles.confirmationLabel}>Period:</Text>
                        <Text style={styles.confirmationValue}>
                          {formatDate(selectedPeriod.startDate)} -{" "}
                          {formatDate(selectedPeriod.endDate)}
                        </Text>
                      </View>
                      <View style={styles.confirmationRow}>
                        <Text style={styles.confirmationLabel}>
                          Total Hours:
                        </Text>
                        <Text style={styles.confirmationValue}>
                          {formatHours(selectedPeriod.totalHours)}
                        </Text>
                      </View>
                      <View style={styles.confirmationRow}>
                        <Text style={styles.confirmationLabel}>
                          Estimated Pay:
                        </Text>
                        <Text style={styles.confirmationValue}>
                          $
                          {calculateGrossPay(
                            selectedPeriod.totalHours,
                            calculateOvertimeHours(selectedPeriod.totalHours)
                          ).toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Notes (Optional)</Text>
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Add any notes for HR or payroll processing..."
                        multiline={true}
                        numberOfLines={3}
                        textAlignVertical="top"
                        returnKeyType="done"
                        blurOnSubmit={true}
                      />
                    </View>

                    <Text style={styles.warningText}>
                      Once submitted, this payroll request cannot be modified.
                      Please ensure all information is correct.
                    </Text>
                  </View>
                )}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setConfirmModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    isSubmitting && styles.disabledButton,
                  ]}
                  onPress={confirmSubmission}
                  disabled={isSubmitting}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.confirmButtonText}>
                    {isSubmitting ? "Submitting..." : "Confirm Submission"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
    fontWeight: "700",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  periodCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  periodDates: {
    flex: 1,
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  periodRange: {
    fontSize: 14,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
  },
  periodStats: {
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  totalHours: {
    color: "#4CAF50",
    fontWeight: "700",
  },
  grossPayRow: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginTop: 8,
    paddingTop: 12,
  },
  grossPayLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  grossPayValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4CAF50",
  },
  periodDetails: {
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  detailsSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  noHoursContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  noHoursText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  noPeriodsContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  noPeriodsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
  },
  noPeriodsSubtext: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 4,
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  historyDates: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  historySubmitted: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  historyStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historyStatItem: {
    alignItems: "center",
  },
  historyStatLabel: {
    fontSize: 12,
    color: "#666",
  },
  historyStatValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 2,
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 12,
    color: "#333",
    lineHeight: 16,
  },
  noHistoryContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  noHistoryText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  // FIXED Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    maxHeight: "85%", // Use percentage instead of dynamic calculation
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
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalScrollView: {
    flexGrow: 0,
    maxHeight: screenHeight * 0.5, // Limit scroll area
  },
  modalBody: {
    padding: 20,
  },
  confirmationDetails: {
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  confirmationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  confirmationLabel: {
    fontSize: 14,
    color: "#666",
  },
  confirmationValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
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
    fontSize: 14,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  warningText: {
    fontSize: 12,
    color: "#FF9800",
    lineHeight: 16,
    fontStyle: "italic",
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
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
