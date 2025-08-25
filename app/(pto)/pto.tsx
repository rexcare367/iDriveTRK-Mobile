import EmptyState from "@/components/EmptyState";
import { router } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import BackgroundEffects from "../../components/BackgroundEffects";
import BottomTabBar from "../../components/BottomTabBar";
import Header from "../../components/Header";
import { api } from "../../utils";

// Type definitions
interface LeaveRequest {
  id: string;
  type: string;
  description: string;
  start_time: string;
  end_time: string;
  duration: number;
  status: string;
  created_by: string;
  assigned_id: string;
}

interface LeaveRequests {
  approved: LeaveRequest[];
  pending: LeaveRequest[];
  rejected: LeaveRequest[];
}

export default function PTOScreen() {
  const { user } = useSelector((state: any) => state.auth);
  const [activeTab, setActiveTab] = useState("pending");
  const [showPTOButton, setShowPTOButton] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequests>({
    approved: [],
    pending: [],
    rejected: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Show PTO button when this screen is active
  useEffect(() => {
    setShowPTOButton(true);
  }, []);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      if (!user?.id) {
        console.log("[PTO] No user id found, skipping fetch.");
        return;
      }
      console.log(`[PTO] Fetching leave requests for user id: ${user.id}`);
      setLoading(true);
      setError(null);
      try {
        console.log(`[PTO] Sending GET request to /api/pto/userid/${user.id}`);
        const response = await api.get(`/api/pto/userid/${user.id}`);
        console.log("[PTO] Response received:", response.data);
        // Assume response.data is an array of leave requests with a 'status' field
        const grouped: LeaveRequests = {
          approved: [],
          pending: [],
          rejected: [],
        };
        (response.data || []).forEach((req: LeaveRequest) => {
          if (grouped[req.status as keyof LeaveRequests]) {
            grouped[req.status as keyof LeaveRequests].push(req);
          } else {
            console.log(
              `[PTO] Unknown status '${req.status}' in request:`,
              req
            );
          }
        });
        setLeaveRequests(grouped);
        console.log("[PTO] Grouped leave requests:", grouped);
      } catch (err) {
        setError("Failed to load requests");
        console.log("[PTO] Error fetching leave requests:", err);
      } finally {
        setLoading(false);
        console.log("[PTO] Fetch leave requests complete. Loading:", false);
      }
    };
    fetchLeaveRequests();
  }, [user?.id]);

  const handlePTOButtonPress = () => {
    router.push("/(pto)/leave-type-selection");
  };

  return (
    <View style={styles.container}>
      <BackgroundEffects />

      <Header user={user} />

      <View style={styles.content}>
        {/* PTO Title Row with PTO Button */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Paid Time Off</Text>
          {showPTOButton && (
            <TouchableOpacity
              style={styles.ptoCircleButtonTop}
              activeOpacity={0.8}
              onPress={handlePTOButtonPress}
            >
              <Text style={styles.ptoButtonText}>PTO</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Vacation Scene/Photo at the top */}
        <View style={styles.vacationPhotoContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            }}
            style={styles.vacationPhoto}
            resizeMode="cover"
          />
          <View style={styles.vacationOverlay}>
            <Text style={styles.vacationText}>
              Take a break, you deserve it!
            </Text>
          </View>
        </View>

        <View style={styles.requestsSection}>
          <Text style={styles.sectionTitle}>Your Requests</Text>

          <View style={styles.tabsContainer}>
            {["approved", "pending", "rejected"].map((tab) => (
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
          {loading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text style={{ color: "red" }}>{error}</Text>
          ) : leaveRequests[activeTab as keyof LeaveRequests]?.length === 0 ? (
            <EmptyState
              icon="alarm-outline"
              text={`No ${activeTab} reqeust.`}
              subtext="make request"
            />
          ) : (
            <ScrollView style={{ maxHeight: 420 }}>
              {leaveRequests[activeTab as keyof LeaveRequests].map(
                (request: LeaveRequest) => (
                  <View key={request.id} style={styles.requestCard}>
                    <View style={styles.requestHeader}>
                      <Text style={styles.requestDate}>
                        {moment(request.start_time).format("MMM Do, h:mm A")} -{" "}
                        {moment(request.start_time).isSame(
                          moment(request.end_time),
                          "day"
                        )
                          ? moment(request.end_time).format("h:mm A")
                          : moment(request.end_time).format("MMM Do, h:mm A")}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          request.status === "approved"
                            ? styles.approvedBadge
                            : request.status === "Pending"
                            ? styles.pendingBadge
                            : styles.rejectedBadge,
                        ]}
                      >
                        <Text style={styles.statusText}>{request?.status}</Text>
                      </View>
                    </View>
                    <View style={styles.requestDetails}>
                      <Text style={styles.requestType}>
                        Type: {request.type} | {request.duration} hrs
                      </Text>
                    </View>
                    <View style={styles.requestDescription}>
                      <Text style={styles.descriptionLabel}>Description:</Text>
                      <Text style={styles.descriptionText}>
                        {request.description}
                      </Text>
                    </View>
                  </View>
                )
              )}
              <View style={{ height: 80 }}></View>
            </ScrollView>
          )}
        </View>
      </View>
      <BottomTabBar activeTab="PTO" />
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
  // PTO Title Row
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  // PTO Button at Top Right
  ptoCircleButtonTop: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1976D2",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1976D2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
    marginLeft: 10,
  },
  ptoButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 2,
  },
  // Vacation photo styles
  vacationPhotoContainer: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 30,
    position: "relative",
  },
  vacationPhoto: {
    width: "100%",
    height: "100%",
  },
  vacationOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    padding: 18,
  },
  vacationText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
    width: "100%",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
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
  // PTO Button Styles (old floating button, now unused)
  ptoButtonContainer: {
    display: "none",
  },
  ptoCircleButton: {
    display: "none",
  },
  ptoNextText: {
    marginTop: 8,
    color: "#1976D2",
    fontSize: 16,
    fontWeight: "600",
  },
  // Hide old request button
  buttonContainer: {
    display: "none",
  },
  requestButton: {
    display: "none",
  },
  requestButtonText: {
    display: "none",
  },
});
