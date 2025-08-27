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
import {
  approveTimesheet,
  fetchTimesheets,
  rejectTimesheet,
} from "../../redux/actions/timesheetActions";

export default function ManagerApprovalScreen() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.user);
  const { timesheets, loading } = useSelector((state: any) => state.timesheet);
  const [filter, setFilter] = useState("PENDING"); // 'PENDING', 'APPROVED', 'REJECTED', 'ALL'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimesheet, setSelectedTimesheet] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  useEffect(() => {
    dispatch(fetchTimesheets() as any);
  }, [dispatch]);

  const filteredTimesheets = timesheets.filter((timesheet: any) => {
    if (filter !== "ALL" && timesheet.status !== filter) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        timesheet.userName?.toLowerCase().includes(query) ||
        timesheet.id?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleApprove = (timesheet: any) => {
    Alert.alert(
      "Approve Timesheet",
      `Are you sure you want to approve this timesheet for ${timesheet.userName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Approve",
          onPress: () => {
            dispatch(approveTimesheet(timesheet.id, currentUser.id));
            Alert.alert("Success", "Timesheet approved successfully");
          },
        },
      ]
    );
  };

  const handleReject = (timesheet: any) => {
    setSelectedTimesheet(timesheet);
    setRejectionReason("");
    setShowRejectionModal(true);
  };

  const submitRejection = () => {
    if (!rejectionReason.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection");
      return;
    }

    dispatch(
      rejectTimesheet(selectedTimesheet.id, currentUser.id, rejectionReason)
    );
    setShowRejectionModal(false);
    setSelectedTimesheet(null);
    Alert.alert("Success", "Timesheet rejected successfully");
  };

  const getStatusColor = (status: any) => {
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

  const renderFilterTabs = () => {
    const tabs = [
      { id: "PENDING", label: "Pending" },
      { id: "APPROVED", label: "Approved" },
      { id: "REJECTED", label: "Rejected" },
      { id: "ALL", label: "All" },
    ];

    return (
      <View style={styles.filterTabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.filterTab,
              filter === tab.id && styles.activeFilterTab,
            ]}
            onPress={() => setFilter(tab.id)}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === tab.id && styles.activeFilterTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderRejectionModal = () => {
    if (!showRejectionModal) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Reject Timesheet</Text>
          <Text style={styles.modalSubtitle}>
            Please provide a reason for rejecting this timesheet.
          </Text>

          <TextInput
            style={styles.reasonInput}
            placeholder="Enter rejection reason"
            multiline
            value={rejectionReason}
            onChangeText={setRejectionReason}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowRejectionModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.rejectButton]}
              onPress={submitRejection}
            >
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by employee name or ID"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {renderFilterTabs()}

        <ScrollView style={styles.timesheetList}>
          {loading ? (
            <Text style={styles.emptyText}>Loading timesheets...</Text>
          ) : filteredTimesheets.length === 0 ? (
            <Text style={styles.emptyText}>No timesheets found</Text>
          ) : (
            filteredTimesheets.map((timesheet: any) => (
              <View key={timesheet.id} style={styles.timesheetCard}>
                <View style={styles.timesheetHeader}>
                  <View>
                    <Text style={styles.employeeName}>
                      {timesheet.userName || "Employee"}
                    </Text>
                    <Text style={styles.timesheetId}>ID: {timesheet.id}</Text>
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

                <View style={styles.timesheetDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Period:</Text>
                    <Text style={styles.detailValue}>{timesheet.period}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date Range:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(timesheet.startDate)} -{" "}
                      {formatDate(timesheet.endDate)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Hours:</Text>
                    <Text style={styles.detailValue}>
                      {timesheet.totalHours}hrs
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Overtime:</Text>
                    <Text style={styles.detailValue}>
                      {timesheet.overtimeHours}hrs
                    </Text>
                  </View>
                  {timesheet.note && (
                    <View style={styles.noteContainer}>
                      <Text style={styles.noteLabel}>Note:</Text>
                      <Text style={styles.noteText}>{timesheet.note}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.timesheetActions}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() =>
                      router.push({
                        pathname: "./timesheet-details",
                        params: {
                          timesheetId: timesheet.id,
                        },
                      })
                    }
                  >
                    <Ionicons name="eye" size={16} color="#002B49" />
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>

                  {timesheet.status === "PENDING" && (
                    <View style={styles.approvalButtons}>
                      <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => handleReject(timesheet)}
                      >
                        <Ionicons
                          name="close-circle-outline"
                          size={16}
                          color="#fff"
                        />
                        <Text style={styles.rejectButtonText}>Reject</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.approveButton}
                        onPress={() => handleApprove(timesheet)}
                      >
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={16}
                          color="#fff"
                        />
                        <Text style={styles.approveButtonText}>Approve</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {renderRejectionModal()}
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
  },
  filterTabs: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeFilterTab: {
    backgroundColor: "#002B49",
  },
  filterTabText: {
    fontSize: 14,
    color: "#666",
  },
  activeFilterTabText: {
    color: "#fff",
    fontWeight: "500",
  },
  timesheetList: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    padding: 16,
    color: "#666",
  },
  timesheetCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timesheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timesheetId: {
    fontSize: 12,
    color: "#666",
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
  timesheetDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  noteContainer: {
    marginTop: 8,
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderRadius: 4,
  },
  noteLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
  },
  timesheetActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewButtonText: {
    marginLeft: 4,
    color: "#002B49",
    fontWeight: "500",
  },
  approvalButtons: {
    flexDirection: "row",
  },
  approveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  approveButtonText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "500",
  },
  rejectButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc3545",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  rejectButtonText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "500",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
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
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#333",
  },
});
