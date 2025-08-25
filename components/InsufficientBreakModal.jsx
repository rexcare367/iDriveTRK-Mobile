import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const InsufficientBreakModal = ({
  visible,
  onCancel,
  onContinue,
  lastClockOutTime,
  hoursSinceLastShift
}) => {
  const formatHours = (hours) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    if (wholeHours === 0) {
      return `${minutes} minutes`;
    } else if (minutes === 0) {
      return `${wholeHours} hour${wholeHours !== 1 ? "s" : ""}`;
    } else {
      return `${wholeHours} hour${wholeHours !== 1 ? "s" : ""} and ${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }
  };

  const formatLastClockOut = (timestamp) => {
    if (!timestamp) return "Unknown";

    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    const timeString = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });

    if (diffDays === 0) {
      return `Today at ${timeString}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${timeString}`;
    } else {
      const dateString = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
      return `${dateString} at ${timeString}`;
    }
  };

  const getWarningLevel = (hours) => {
    if (hours < 8) return "critical";
    if (hours < 10) return "warning";
    return "normal";
  };

  const warningLevel = getWarningLevel(hoursSinceLastShift || 0);
  const warningColors = {
    critical: "#FF3B30",
    warning: "#FF9500",
    normal: "#34C759"
  };

  const warningBackgrounds = {
    critical: "#FFF5F5",
    warning: "#FFF8F0",
    normal: "#F0FFF4"
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: warningBackgrounds[warningLevel] }
            ]}
          >
            <Ionicons
              name="warning"
              size={32}
              color={warningColors[warningLevel]}
            />
          </View>

          <Text style={styles.title}>Insufficient Rest Period</Text>

          <View
            style={[
              styles.warningContainer,
              { backgroundColor: warningBackgrounds[warningLevel] }
            ]}
          >
            <Text
              style={[
                styles.warningText,
                { color: warningColors[warningLevel] }
              ]}
            >
              ⚠️ A full 10-hour break has not been recorded
            </Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Last Clock Out:</Text>
              <Text style={styles.detailValue}>
                {formatLastClockOut(lastClockOutTime)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time Since Last Shift:</Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: warningColors[warningLevel], fontWeight: "600" }
                ]}
              >
                {formatHours(hoursSinceLastShift || 0)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Required Rest Period:</Text>
              <Text style={styles.detailValue}>10 hours</Text>
            </View>
          </View>

          <View style={styles.safetyNotice}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#666" />
            <Text style={styles.safetyText}>
              Adequate rest is essential for safe driving. Consider waiting for
              a full 10-hour break.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.continueButton]}
              onPress={onContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue Anyway</Text>
            </TouchableOpacity>
          </View>

          {/* Disclaimer */}
          <Text style={styles.disclaimer}>
            By continuing, you acknowledge that you have not had the recommended
            10-hour rest period.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1F2937",
    marginBottom: 16
  },
  warningContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FEE2E2"
  },
  warningText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center"
  },
  detailsContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1
  },
  detailValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
    flex: 1,
    textAlign: "right"
  },
  safetyNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20
  },
  safetyText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB"
  },
  continueButton: {
    backgroundColor: "#EF4444"
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151"
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white"
  },
  disclaimer: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 14
  }
});

export default InsufficientBreakModal;
