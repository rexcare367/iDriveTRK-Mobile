import BackgroundEffects from "@/components/BackgroundEffects";
import BottomTabBar from "@/components/BottomTabBar";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Type definitions
interface LeaveBalance {
  type: string;
  days: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface LeaveRequest {
  id: string;
  dateRange: string;
  type: string;
  hours: number;
  description: string;
  status: string;
}

interface LeaveRequests {
  Approved: LeaveRequest[];
  Pending: LeaveRequest[];
  Rejected: LeaveRequest[];
}

export default function SickLeaveScreen() {
  const [activeTab, setActiveTab] = useState("Approved");

  const handlePTOButtonPress = () => {
    router.push("./pto-type-selection");
  };

  const leaveBalances: LeaveBalance[] = [
    { type: "PTO", days: 14, icon: "airplane-outline", color: "#E0E0E0" },
    {
      type: "Sick Leave",
      days: 3,
      icon: "thermometer-outline",
      color: "#082640",
    },
    { type: "Personal", days: 2, icon: "person-outline", color: "#E0E0E0" },
  ];

  const leaveRequests: LeaveRequests = {
    Approved: [
      {
        id: "1",
        dateRange: "Jul 7th - Jul 9th",
        type: "Sick Leave",
        hours: 48,
        description: "Sick leave for a cold",
        status: "Approved",
      },
      {
        id: "2",
        dateRange: "Jul 7th - Jul 9th",
        type: "Sick Leave",
        hours: 48,
        description: "Sick leave for a cold",
        status: "Approved",
      },
      {
        id: "3",
        dateRange: "Jul 7th - Jul 9th",
        type: "Sick Leave",
        hours: 48,
        description: "Sick leave for a cold",
        status: "Approved",
      },
      {
        id: "4",
        dateRange: "Jul 7th - Jul 9th",
        type: "Sick Leave",
        hours: 48,
        description: "Sick leave for a cold",
        status: "Approved",
      },
    ],
    Pending: [
      {
        id: "3",
        dateRange: "Jul 7th - Jul 9th",
        type: "Sick Leave",
        hours: 48,
        description: "Sick leave for a cold",
        status: "Pending",
      },
      {
        id: "4",
        dateRange: "Jul 7th - Jul 9th",
        type: "Sick Leave",
        hours: 48,
        description: "Sick leave for a cold",
        status: "Pending",
      },
    ],
    Rejected: [
      {
        id: "5",
        dateRange: "Jul 7th - Jul 9th",
        type: "Sick Leave",
        hours: 48,
        description: "Sick leave for a cold",
        status: "Rejected",
      },
      {
        id: "6",
        dateRange: "Jul 7th - Jul 9th",
        type: "Sick Leave",
        hours: 48,
        description: "Sick leave for a cold",
        status: "Rejected",
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundEffects />

      <Header />

      <View style={styles.content}>
        <Text style={styles.title}>Paid Time Off</Text>

        <View style={styles.balanceCardsContainer}>
          {leaveBalances.map((leave, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.balanceCard,
                {
                  backgroundColor:
                    leave.type === "Sick Leave" ? leave.color : "#fff",
                },
              ]}
              onPress={() =>
                leave.type === "PTO"
                  ? router.push("/(pto)/pto-dashboard")
                  : leave.type === "Sick Leave"
                  ? router.push("/(pto)/sick-leave-form")
                  : router.push("/(pto)/personal-leave-form")
              }
            >
              <Ionicons
                name={leave.icon}
                size={24}
                color={leave.type === "Sick Leave" ? "#fff" : "#000"}
              />
              <Text
                style={[
                  styles.balanceDays,
                  { color: leave.type === "Sick Leave" ? "#fff" : "#000" },
                ]}
              >
                {leave.days} Days
              </Text>
              <Text
                style={[
                  styles.balanceType,
                  { color: leave.type === "Sick Leave" ? "#fff" : "#666" },
                ]}
              >
                {leave.type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.requestsSection}>
          <Text style={styles.sectionTitle}>Your Requests</Text>

          <View style={styles.tabsContainer}>
            {["Approved", "Pending", "Rejected"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView style={{ maxHeight: 420 }}>
            {leaveRequests[activeTab as keyof LeaveRequests].map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <Text style={styles.requestDate}>{request.dateRange}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      request.status === "Approved"
                        ? styles.approvedBadge
                        : request.status === "Pending"
                        ? styles.pendingBadge
                        : styles.rejectedBadge,
                    ]}
                  >
                    <Text style={styles.statusText}>{request.status}</Text>
                  </View>
                </View>
                <View style={styles.requestDetails}>
                  <Text style={styles.requestType}>
                    Type: {request.type} | No. of Hours: {request.hours}hrs
                  </Text>
                </View>
                <View style={styles.requestDescription}>
                  <Text style={styles.descriptionLabel}>Description:</Text>
                  <Text style={styles.descriptionText}>
                    {request.description}
                  </Text>
                </View>
              </View>
            ))}
            <View style={{ height: 80 }}></View>
          </ScrollView>
        </View>
      </View>

      {/* PTO Floating Button and "Click Next" */}
      <View style={styles.ptoButtonContainer}>
        <TouchableOpacity
          style={styles.ptoCircleButton}
          activeOpacity={0.8}
          onPress={handlePTOButtonPress}
        >
          <Text style={styles.ptoButtonText}>PTO</Text>
        </TouchableOpacity>
        {/* <Text style={styles.ptoNextText}>Click Next</Text> */}
      </View>

      <BottomTabBar activeTab="PTO" />
    </SafeAreaView>
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
  balanceCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  balanceCard: {
    width: "31%",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  balanceDays: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  balanceType: {
    fontSize: 12,
    marginTop: 5,
  },
  requestsSection: {
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    paddingVertical: 10,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#082640",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#082640",
    fontWeight: "600",
  },
  requestCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  requestDate: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  approvedBadge: {
    backgroundColor: "#e6f7e6",
  },
  pendingBadge: {
    backgroundColor: "#f0f0f0",
  },
  rejectedBadge: {
    backgroundColor: "#ffe6e6",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  requestDetails: {
    marginBottom: 10,
  },
  requestType: {
    fontSize: 14,
    color: "#666",
  },
  requestDescription: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
  },
  ptoButtonContainer: {
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  ptoCircleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1976D2",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1976D2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  ptoButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
    letterSpacing: 2,
  },
});
