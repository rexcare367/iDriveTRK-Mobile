import { Feather } from "@expo/vector-icons";
import moment from "moment";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

interface TimelineEntryProps {
  entry: any;
  isLast: any;
  onEditEntry: any;
}

const TimelineEntry = ({ entry, isLast, onEditEntry }: TimelineEntryProps) => {
  const { user } = useSelector((state: any) => state.auth);
  const { type, time, start, end, label } = entry;
  // Dot color by type
  const dotColor =
    type === "clockin"
      ? "#4CAF50"
      : type === "clockout"
      ? "#F44336"
      : "#FFC107"; // break

  // Time label
  let timeLabel = "";
  if (type === "break" && start) {
    timeLabel = moment(start).format("HH:mm");
  } else if (time) {
    timeLabel = moment(time).format("HH:mm");
  }

  // Duration for break
  let duration = null;
  if (type === "break" && start && end) {
    const d = moment.duration(moment(end).diff(moment(start)));
    const hours = Math.floor(d.asHours());
    const minutes = d.minutes();
    duration = `${hours}h ${minutes}m`;
  }

  return (
    <View style={styles.timelineEntry}>
      {/* Timeline Line and Dot */}
      <View style={styles.timelineLeft}>
        <View style={[styles.timelineDot, { backgroundColor: dotColor }]} />
        {!isLast && <View style={styles.timelineLine} />}
      </View>

      {/* Time Label */}
      <View style={styles.timeLabel}>
        <Text style={styles.timeLabelText}>{timeLabel}</Text>
      </View>

      {/* Entry Card */}
      <View style={styles.entryCard}>
        <View style={styles.entryCardHeader}>
          <View style={styles.userInfoSection}>
            <View style={styles.userInfo}>
              <Image
                source={{
                  uri: user?.avatar,
                }}
                style={styles.userAvatar}
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {user?.firstName + " " + user?.lastName}
                </Text>
                <Text style={styles.email}>{user?.email}</Text>
              </View>
            </View>
            <View style={styles.entryActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => onEditEntry(entry)}
              >
                <Feather name="edit" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.entryCardContent}>
          <View style={styles.entryMainInfo}>
            <Text style={styles.entryAction}>{label}</Text>
            {type === "break" && duration && (
              <>
                <Text style={styles.entryDivider}>|</Text>
                <Text style={styles.entryDuration}>{duration}</Text>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timelineEntry: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: "center",
    width: 32,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#e0e0e0",
    marginTop: 2,
  },
  timeLabel: {
    width: 70,
    alignItems: "flex-end",
    marginRight: 12,
  },
  timeLabelText: {
    fontSize: 14,
    color: "#666",
  },
  entryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  entryCardHeader: {
    marginBottom: 8,
  },
  userInfoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#f0f0f0",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  email: {
    fontSize: 12,
    fontWeight: "500",
    color: "#555",
    marginBottom: 4,
  },
  entryActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  entryCardContent: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 8,
  },
  entryMainInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  entryAction: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  entryDivider: {
    fontSize: 16,
    color: "#ccc",
    marginHorizontal: 12,
  },
  entryDuration: {
    fontSize: 14,
    color: "#888",
  },
});

export default TimelineEntry;
