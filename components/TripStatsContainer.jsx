import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { api } from "../utils";

const TripStatsContainer = ({
  onCompleteHistoryPress,
  onAssignedTripPress,
  variant = "default", // 'default' or 'reversed'
  selectedPayPeriod = null,
}) => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    completedTrips: 0,
    assignedTrips: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedPayPeriod) {
      fetchStats();
    }
  }, [selectedPayPeriod]);

  const fetchStats = async () => {
    if (!selectedPayPeriod) return;

    try {
      setLoading(true);

      // Use moment to format the pay-period dates
      const startTime = moment(selectedPayPeriod.start_date).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      const endTime = moment(selectedPayPeriod.end_date).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

      const response = await api.get(
        `/api/analytic/schedules?user_id=${user.id}&start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}`
      );

      if (response.data) {
        setStats({
          completedTrips: response.data.counts_by_status.completed || 0,
          assignedTrips: response.data.counts_by_status.scheduled || 0,
        });
        console.log("response.data", response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.statsContainer}>
      <TouchableOpacity
        style={[
          styles.statBox,
          variant === "reversed" ? styles.statBoxLight : null,
        ]}
        onPress={onCompleteHistoryPress}
      >
          <View style={styles.cardIcon}>
          <Text
            style={[
              styles.statNumber,
              { color: variant === "reversed" ? "#082640" : "#fff" },
            ]}
          >
            {loading ? "..." : stats.completedTrips}
          </Text>
        <Ionicons
          name="car"
          size={48}
          color={variant === "reversed" ? "#082640" : "#fff"}
        />
          </View>
          <Text
          style={[
            styles.statLabel,
            variant === "reversed" ? styles.statLabelDark : null,
          ]}
        >
          Completed Trips
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.statBox,
          variant === "reversed" ? null : styles.statBoxLight,
          { display: "flex", justifyContent: "space-between" },
        ]}
        onPress={onAssignedTripPress}
      >
          <View style={styles.cardIcon}>

        <Text
          style={[
            styles.statNumber,
            { color: variant === "reversed" ? "#fff" : "#082640" },
          ]}
        >
          {loading ? "..." : stats.assignedTrips}
        </Text>
        <Ionicons
          name="document-text"
          size={48}
          color={variant === "reversed" ? "#fff" : "#082640"}
        />
    </View>



        <Text
          style={[
            styles.statLabel,
            variant === "reversed" ? null : styles.statLabelDark,
          ]}
        >
          Assigned Trips
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  statBox: {
    backgroundColor: "#082640",
    borderRadius: 10,
    padding: 15,
    width: "48%",
    alignItems: "flex-start",
  },
  cardIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  statBoxLight: {
    backgroundColor: "rgba(240, 240, 240, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(8, 38, 64, 0.3)",
    display: "flex",
    justifyContent: "space-between",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#e0e0e0",
  },
  statLabelDark: {
    color: "#666",
  },
});

export default TripStatsContainer;
