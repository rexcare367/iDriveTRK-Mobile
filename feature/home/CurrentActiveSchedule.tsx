import { ISchedule } from "@/redux/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import moment from "moment";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { selectTrip } from "../../redux/actions/driverActions";

interface CurrentActiveScheduleProps {
  schedule: ISchedule;
}

function CurrentActiveSchedule({ schedule }: CurrentActiveScheduleProps) {
  const dispatch = useDispatch();

  if (schedule) {
    return (
      <View style={styles.todaysTripContainer}>
        <View style={styles.todaysTripHeader}>
          <Text style={styles.todaysTripTitle}>Your current Trip</Text>
        </View>

        <View style={styles.tripCard}>
          <View style={styles.tripHeader}>
            <Text style={styles.tripName}>{schedule.job?.name}</Text>
            <View style={styles.tripTime}>
              <Ionicons name="time-outline" size={16} color="#082640" />
              <Text style={styles.tripTimeText}>
                {schedule.start_time
                  ? `${moment(schedule.start_time).format("h:mm A")} - ${moment(
                      schedule.end_time
                    ).format("h:mm A")}`
                  : "Time not set"}
              </Text>
            </View>
          </View>

          {schedule.job.description && (
            <Text
              style={{
                fontSize: 13,
                color: "#666",
                marginBottom: 8,
              }}
            >
              {schedule.job.description}
            </Text>
          )}

          {Array.isArray(schedule.job.routes) &&
            schedule.job.routes.length > 0 && (
              <View style={styles.tripStops}>
                {schedule.job.routes.map((stop: any, index: number) => (
                  <View key={index} style={styles.tripStop}>
                    <View style={styles.stopDot} />
                    <Text style={styles.stopName}>
                      {stop?.label || "Unnamed Stop"}
                    </Text>
                  </View>
                ))}
              </View>
            )}

          <View style={styles.tripMeta}>
            {schedule.job.driving_distance && (
              <View style={styles.tripMetaItem}>
                <Ionicons name="speedometer-outline" size={14} color="#666" />
                <Text style={styles.tripMetaText}>
                  {schedule.job.driving_distance}
                </Text>
              </View>
            )}
            {schedule.start_time && schedule.end_time && (
              <View style={styles.tripMetaItem}>
                <Ionicons name="hourglass-outline" size={14} color="#666" />
                <Text style={styles.tripMetaText}>
                  {`${moment(schedule.end_time).diff(
                    moment(schedule.start_time),
                    "minutes"
                  )} min`}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.viewTripButton}
            onPress={() => {
              dispatch(selectTrip(schedule, []));
              router.push({
                pathname: "/(home)/trip-details",
                params: {
                  tripId: schedule.id,
                  tripName: schedule.name,
                  isAssigned: "true",
                },
              });
            }}
          >
            <Text style={styles.viewTripButtonText}>View Trip Details</Text>
            <Ionicons name="arrow-forward" size={16} color="#082640" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  todaysTripContainer: {
    marginBottom: 20,
  },
  todaysTripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  todaysTripTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tripCard: {
    backgroundColor: "#f8fbff",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0eaf9",
  },
  tripHeader: {
    marginBottom: 10,
  },
  tripName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  tripTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripTimeText: {
    fontSize: 14,
    marginLeft: 5,
    color: "#082640",
    fontWeight: "500",
  },
  tripStops: {
    marginBottom: 10,
  },
  tripStop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#082640",
    marginRight: 8,
  },
  stopName: {
    fontSize: 14,
  },
  tripMeta: {
    flexDirection: "row",
    marginBottom: 15,
  },
  tripMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  tripMetaText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  viewTripButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0eaf9",
  },
  viewTripButtonText: {
    fontSize: 14,
    color: "#082640",
    fontWeight: "500",
    marginRight: 5,
  },
});

export default CurrentActiveSchedule;
