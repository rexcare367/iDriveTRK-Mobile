import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import TimelineEntry from "./TimelineEntry";
import moment from "moment";

const DateSection = ({ date, dayData, onEditEntry, formatTime }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDateHeader = (dateString) => {
    const date = moment(dateString);
    return date.format("dddd, MMMM Do, YYYY");
  };

  const handleToggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Add a function to calculate total hours
  const calculateTotalHours = () => {
    if (!dayData.clockin_time || !dayData.clockout_time) return "0h 0m";
    const start = moment(dayData.clockin_time);
    const end = moment(dayData.clockout_time);
    let total = moment.duration(end.diff(start));
    let breakDuration = moment.duration(0);
    if (Array.isArray(dayData.breaks)) {
      dayData.breaks.forEach((b) => {
        if (b.start && b.end) {
          const bStart = moment(b.start);
          const bEnd = moment(b.end);
          breakDuration.add(moment.duration(bEnd.diff(bStart)));
        }
      });
    }
    total.subtract(breakDuration);
    const hours = Math.floor(total.asHours());
    const minutes = total.minutes();
    return `${hours}h ${minutes}m`;
  };

  return (
    <View key={date} style={styles.dateSection}>
      {/* Date Header */}
      <TouchableOpacity
        style={styles.dateHeader}
        onPress={handleToggleExpansion}
        activeOpacity={0.7}
      >
        <View style={styles.dateHeaderContent}>
          <View style={styles.dateIconContainer}>
            <Icon
              name={isExpanded ? "chevron-down" : "chevron-right"}
              size={16}
              color="#fff"
            />
          </View>
          <Text style={styles.dateHeaderText}>
            {formatDateHeader(dayData.created_at)}
          </Text>

          <Text style={styles.totalHoursText}>{calculateTotalHours()}</Text>
        </View>
      </TouchableOpacity>

      {/* Timeline Entries */}
      {isExpanded && (
        <View style={styles.timelineContent}>
          {/* Individual Clock Entries */}
          <View style={styles.entriesSection}>
            <View style={styles.entriesHeader}>
              <Text style={styles.entriesTitle}>Timeline</Text>
            </View>

            {(() => {
              const timeline = [
                dayData.clockin_time && {
                  type: "clockin",
                  time: dayData.clockin_time,
                  label: "Clock In",
                  id: "clockin",
                },
                ...dayData.breaks.map((b, idx) => ({
                  type: "break",
                  start: b.start,
                  end: b.end,
                  label: `Break ${idx + 1}`,
                  id: b.id,
                })),
                dayData.clockout_time && {
                  type: "clockout",
                  time: dayData.clockout_time,
                  label: "Clock Out",
                  id: "clockout",
                },
              ].filter(Boolean);
              return timeline.map((item, idx) => (
                <TimelineEntry
                  key={item.id}
                  type={item.type}
                  time={item.time}
                  start={item.start}
                  end={item.end}
                  label={item.label}
                  isLast={idx === timeline.length - 1}
                  onEditEntry={onEditEntry}
                  formatTime={formatTime}
                />
              ));
            })()}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateSection: {
    marginBottom: 20,
  },
  dateHeader: {
    marginBottom: 16,
  },
  dateHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#002B49",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dateHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    color: "#333",
    letterSpacing: 0.3,
  },
  totalHoursText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4CAF50",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timelineContent: {
    paddingLeft: 14,
  },
  summarySection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  sessionSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sessionTime: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  sessionDuration: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#4CAF50",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4CAF50",
  },
  entriesSection: {
    marginTop: 8,
  },
  entriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  entriesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  noEntriesContainer: {
    alignItems: "center",
    paddingVertical: 40,
    opacity: 0.6,
  },
  noEntriesText: {
    fontSize: 14,
    color: "#999",
    marginTop: 12,
    marginBottom: 16,
  },
  addFirstEntryButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addFirstEntryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default DateSection;
