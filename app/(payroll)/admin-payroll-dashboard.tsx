import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
import BackgroundEffects from "../../components/BackgroundEffects";
import {
  approvePayrollSubmission,
  fetchAllPayrollSubmissions,
  rejectPayrollSubmission,
} from "../../redux/actions/payrollActions";

export default function AdminPayrollDashboard() {
  const dispatch = useDispatch();
  const { payrollSubmissions, isLoading } = useSelector(
    (state: any) => state.payroll
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchAllPayrollSubmissions());
  }, [dispatch]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatHours = (hours) => {
    return `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
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

  const handleApprove = (submission) => {
    Alert.alert(
      "Approve Payroll",
      `Approve payroll submission for ${submission.userName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: () => {
            dispatch(approvePayrollSubmission(submission.id));
          },
        },
      ]
    );
  };

  const handleReject = (submission) => {
    Alert.alert(
      "Reject Payroll",
      `Reject payroll submission for ${submission.userName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            dispatch(rejectPayrollSubmission(submission.id));
          },
        },
      ]
    );
  };

  const handleExportToSpreadsheet = async (format = "csv") => {
    try {
      const filteredSubmissions = getFilteredSubmissions();
      const csvData = generateCSVData(filteredSubmissions);

      const fileName = `payroll_export_${
        new Date().toISOString().split("T")[0]
      }.${format}`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, csvData, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: format === "csv" ? "text/csv" : "application/vnd.ms-excel",
          dialogTitle: "Export Payroll Data",
        });
      }

      setExportModalVisible(false);
      Alert.alert("Success", "Payroll data exported successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to export payroll data");
    }
  };

  const getFilteredSubmissions = () => {
    if (!payrollSubmissions) return [];

    return payrollSubmissions.filter((submission) => {
      const matchesSearch = submission.userName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || submission.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const calculateTotals = (submissions) => {
    return submissions.reduce(
      (totals, submission) => ({
        totalEmployees: totals.totalEmployees + 1,
        totalHours:
          totals.totalHours +
          submission.regularHours +
          submission.overtimeHours,
        totalPay: totals.totalPay + submission.grossPay,
        totalOvertime: totals.totalOvertime + submission.overtimeHours,
      }),
      { totalEmployees: 0, totalHours: 0, totalPay: 0, totalOvertime: 0 }
    );
  };

  const filteredSubmissions = getFilteredSubmissions();
  const totals = calculateTotals(filteredSubmissions);

  const renderSubmissionRow = ({ item: submission }) => (
    <TouchableOpacity
      style={styles.submissionRow}
      onPress={() => {
        setSelectedSubmission(submission);
        setDetailModalVisible(true);
      }}
    >
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{submission.userName}</Text>
        <Text style={styles.employeeId}>{submission.department}</Text>
      </View>

      {/* <View style={styles.periodInfo}>
        <Text style={styles.periodText}>
          {formatDate(submission.periodStart)} -{" "}
          {formatDate(submission.periodEnd)}
        </Text>
        <Text style={styles.submittedText}>
          Submitted {formatDate(submission.submittedAt)}
        </Text>
      </View> */}

      <View style={styles.hoursInfo}>
        <Text style={styles.hoursText}>
          {formatHours(submission.regularHours + submission.overtimeHours)}
        </Text>
        {submission.overtimeHours > 0 && (
          <Text style={styles.overtimeText}>
            +{formatHours(submission.overtimeHours)} OT
          </Text>
        )}
      </View>

      <View style={styles.payInfo}>
        <Text style={styles.payText}>
          {formatCurrency(submission.grossPay)}
        </Text>
      </View>

      <View style={styles.statusInfo}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(submission.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {submission.status.replace("_", " ").toUpperCase()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <BackgroundEffects />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payroll Dashboard</Text>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => setExportModalVisible(true)}
        >
          <Icon name="download" size={20} color="#4CAF50" />
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totals.totalEmployees}</Text>
          <Text style={styles.summaryLabel}>Employees</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {formatHours(totals.totalHours)}
          </Text>
          <Text style={styles.summaryLabel}>Total Hours</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {formatCurrency(totals.totalPay)}
          </Text>
          <Text style={styles.summaryLabel}>Total Pay</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {formatHours(totals.totalOvertime)}
          </Text>
          <Text style={styles.summaryLabel}>Overtime</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search employees..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterButtons}>
          {["all", "pending", "approved", "processed"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                filterStatus === status && styles.activeFilterButton,
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterStatus === status && styles.activeFilterButtonText,
                ]}
              >
                {status === "all" ? "All" : status.replace("_", " ")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Spreadsheet Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.employeeHeader]}>Employee</Text>
        <Text style={[styles.headerCell, styles.hoursHeader]}>Hours</Text>
        <Text style={[styles.headerCell, styles.payHeader]}>Pay</Text>
        <Text style={[styles.headerCell, styles.statusHeader]}>Status</Text>
      </View>

      {/* Submissions List */}
      <FlatList
        data={filteredSubmissions}
        renderItem={renderSubmissionRow}
        keyExtractor={(item) => item.id.toString()}
        style={styles.submissionsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="file-text" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No payroll submissions found</Text>
          </View>
        }
      />

      {/* Detail Modal */}
      <Modal
        visible={detailModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payroll Details</Text>
              <TouchableOpacity
                onPress={() => setDetailModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedSubmission && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>
                    Employee Information
                  </Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>
                      {selectedSubmission.userName}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Department:</Text>
                    <Text style={styles.detailValue}>
                      {selectedSubmission.department}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Pay Period</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Start Date:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedSubmission.periodStart)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>End Date:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedSubmission.periodEnd)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Submitted:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedSubmission.submittedAt)}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Hours & Pay</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Regular Hours:</Text>
                    <Text style={styles.detailValue}>
                      {formatHours(selectedSubmission.regularHours)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Overtime Hours:</Text>
                    <Text style={styles.detailValue}>
                      {formatHours(selectedSubmission.overtimeHours)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Hours:</Text>
                    <Text style={[styles.detailValue, styles.totalValue]}>
                      {formatHours(
                        selectedSubmission.regularHours +
                          selectedSubmission.overtimeHours
                      )}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Gross Pay:</Text>
                    <Text style={[styles.detailValue, styles.payValue]}>
                      {formatCurrency(selectedSubmission.grossPay)}
                    </Text>
                  </View>
                </View>

                {selectedSubmission.notes && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Notes</Text>
                    <Text style={styles.notesText}>
                      {selectedSubmission.notes}
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              {selectedSubmission?.status === "pending" && (
                <>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.rejectModalButton]}
                    onPress={() => {
                      handleReject(selectedSubmission);
                      setDetailModalVisible(false);
                    }}
                  >
                    <Text style={styles.rejectModalButtonText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.approveModalButton]}
                    onPress={() => {
                      handleApprove(selectedSubmission);
                      setDetailModalVisible(false);
                    }}
                  >
                    <Text style={styles.approveModalButtonText}>Approve</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Export Modal */}
      <Modal
        visible={exportModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setExportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.exportModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Export Payroll Data</Text>
              <TouchableOpacity
                onPress={() => setExportModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.exportOptions}>
              <TouchableOpacity
                style={styles.exportOption}
                onPress={() => handleExportToSpreadsheet("csv")}
              >
                <Icon name="file-text" size={32} color="#4CAF50" />
                <Text style={styles.exportOptionTitle}>Export as CSV</Text>
                <Text style={styles.exportOptionDescription}>
                  Compatible with Excel, Google Sheets, and other spreadsheet
                  applications
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.exportOption}
                onPress={() => handleExportToSpreadsheet("xlsx")}
              >
                <Icon name="file" size={32} color="#2196F3" />
                <Text style={styles.exportOptionTitle}>Export as Excel</Text>
                <Text style={styles.exportOptionDescription}>
                  Native Excel format with formatting and formulas
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
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 16,
    marginLeft: 8,
    gap: 12,
  },
  summaryCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  filtersContainer: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
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
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#333",
  },
  filterButtons: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  activeFilterButton: {
    backgroundColor: "#4CAF50",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    textTransform: "capitalize",
  },
  activeFilterButtonText: {
    color: "#fff",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#f0f0f0",
  },
  headerCell: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
  },
  employeeHeader: {
    flex: 2,
  },
  periodHeader: {
    flex: 2,
  },
  hoursHeader: {
    flex: 1.5,
    textAlign: "center",
  },
  payHeader: {
    flex: 1.5,
    textAlign: "center",
  },
  statusHeader: {
    flex: 1.5,
    textAlign: "center",
  },
  actionsHeader: {
    flex: 1.5,
    textAlign: "center",
  },
  submissionsList: {
    flex: 1,
  },
  submissionRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  employeeInfo: {
    flex: 2,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  employeeId: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  periodInfo: {
    flex: 2,
  },
  periodText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  submittedText: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  hoursInfo: {
    flex: 1.5,
    alignItems: "center",
  },
  hoursText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  overtimeText: {
    fontSize: 11,
    color: "#FF9800",
    marginTop: 2,
  },
  payInfo: {
    flex: 1.5,
    alignItems: "center",
  },
  payText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4CAF50",
  },
  statusInfo: {
    flex: 1.5,
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  actionsInfo: {
    flex: 1.5,
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 4,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  viewButton: {
    padding: 6,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
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
    maxWidth: 500,
    maxHeight: "80%",
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
    maxHeight: 400,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  totalValue: {
    color: "#4CAF50",
  },
  payValue: {
    color: "#4CAF50",
    fontSize: 16,
  },
  notesText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  rejectModalButton: {
    backgroundColor: "#F44336",
  },
  rejectModalButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  approveModalButton: {
    backgroundColor: "#4CAF50",
  },
  approveModalButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  exportModalContent: {
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
  exportOptions: {
    padding: 20,
  },
  exportOption: {
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 12,
    marginBottom: 12,
  },
  exportOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    marginBottom: 4,
  },
  exportOptionDescription: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },
});
