import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";


import api from "@/utils/apiClient";

interface TripCompleteHistoryScreenProps {
  payPeriods: any[];
  payPeriodsLoading: boolean;
  payPeriodsError: string | null;
  selectedPayPeriod?: any;
}

export default function TripCompleteHistoryScreen({
  payPeriods = [],
  payPeriodsLoading = false,
  payPeriodsError,
  selectedPayPeriod
}: TripCompleteHistoryScreenProps) {
  const { user } = useSelector((state: any) => state.auth);
  const [completedTrips, setCompletedTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to calculate duration from start_time and end_time
  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) {
      return "Duration not available";
    }

    try {
      const start = moment(startTime);
      const end = moment(endTime);

      if (!start.isValid() || !end.isValid()) {
        return "Duration not available";
      }

      const duration = moment.duration(end.diff(start));
      const hours = Math.floor(duration.asHours());
      const minutes = duration.minutes();

      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    } catch (error) {
      console.error("Error calculating duration:", error);
      return "Duration not available";
    }
  };

  // Function to fetch completed trips from backend
  const fetchCompletedTrips = async () => {
    if (!selectedPayPeriod) return;

    try {
      setLoading(true);

      // Use pay-period dates instead of year-long range
      const startTime = moment(selectedPayPeriod.start_date).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      const endTime = moment(selectedPayPeriod.end_date).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

      const response = await api.get(
        `/api/schedules?user_id=${user.id}&start_time=${startTime}&end_time=${endTime}&status=completed`
      );

      console.log("response.data.length", response.data.length);

      if (response.data && response.data.length > 0) {
        setCompletedTrips(response.data);
      } else {
        setCompletedTrips([]);
      }
    } catch (error) {
      console.error("Error fetching completed trips:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch completed trips when component mounts or pay-period changes
  useEffect(() => {
    if (user && user.id && selectedPayPeriod) {
      fetchCompletedTrips();
    }
  }, [user, selectedPayPeriod]);

  const handleTripSelect = (trip: any) => {
    router.push({
      pathname: "/(trips)/trip-details-history",
      params: { tripId: trip.id },
    });
  };

  return (
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
            placeholder="Search for Trip..."
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.calendarButton}>
            <Ionicons name="calendar" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.monthLabel}>{moment().format("MMMM YYYY")}</Text>

        <ScrollView style={styles.tripList}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading completed trips...</Text>
            </View>
          ) : completedTrips.length > 0 ? (
            completedTrips.map((trip, index) => (
              <View key={trip.id}>
                <TouchableOpacity
                  style={styles.tripItem}
                  onPress={() => handleTripSelect(trip)}
                >
                  <View style={styles.tripIconContainer}>
                    <Ionicons name="car-outline" size={20} color="#000" />
                  </View>
                  <View style={styles.tripDetails}>
                    <View style={styles.dateAndBadgeContainer}>
                      <Text style={styles.tripDate}>
                        {trip.date
                          ? moment(trip.date).format("DD MMM, YYYY")
                          : trip.start_time
                          ? moment(trip.start_time).format("DD MMM, YYYY")
                          : "Date not available"}
                      </Text>
                      <View style={styles.jobBadge}>
                        <Text style={styles.jobBadgeText}>{trip.job.name}</Text>
                      </View>
                    </View>
                    <Text style={styles.tripRoute}>
                      {trip?.job?.routes[1]?.label} -{" "}
                      {trip?.job?.routes[trip?.job?.routes.length - 1]?.label}
                    </Text>
                    <Text style={styles.tripDuration}>
                      {calculateDuration(trip.start_time, trip.end_time)}
                    </Text>
                  </View>
                </TouchableOpacity>
                {index !== completedTrips.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No completed trips found</Text>
            </View>
          )}
          <View style={styles.divider} />
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  calendarButton: {
    padding: 5,
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  tripList: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#A6A6A6",
    marginVertical: 8,
  },
  tripItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  tripIconContainer: {
    marginRight: 10,
  },
  tripDetails: {
    flex: 1,
  },
  dateAndBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  tripDate: {
    fontSize: 12,
    color: "#666",
  },
  tripRoute: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  tripDuration: {
    fontSize: 12,
    color: "#666",
  },
  jobBadge: {
    backgroundColor: "#082640",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  jobBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
