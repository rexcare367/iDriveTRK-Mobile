import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { api } from "../utils";

const TripStatsContainer = ({
  onCompleteHistoryPress,
  onAssignedTripPress,
  variant = "default", // 'default' or 'reversed'
}) => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    completedTrips: 0,
    assignedTrips: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/analytic/schedules?user_id=${user.id}`
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
        <Ionicons
          name="car"
          size={24}
          color={variant === "reversed" ? "#082640" : "#fff"}
        />
        {
          <Text
            style={[
              styles.statNumber,
              { color: variant === "reversed" ? "#082640" : "#fff" },
            ]}
          >
            {loading ? "..." : stats.completedTrips}
          </Text>
        }
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
        <Ionicons
          name="document-text"
          size={24}
          color={variant === "reversed" ? "#fff" : "#082640"}
        />

        <Text
          style={[
            styles.statNumber,
            { color: variant === "reversed" ? "#fff" : "#082640" },
          ]}
        >
          {loading ? "..." : stats.assignedTrips}
        </Text>

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
  statBoxLight: {
    backgroundColor: "#f0f0f0",
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
