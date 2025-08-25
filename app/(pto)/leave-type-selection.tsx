import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Type definitions
interface LeaveType {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const leaveTypes: LeaveType[] = [
  { label: "PTO", value: "PTO", icon: "briefcase-outline", color: "#1976D2" },
  {
    label: "Holiday Pay",
    value: "Holiday Pay",
    icon: "calendar-outline",
    color: "#43A047",
  },
  {
    label: "Sick Leave",
    value: "Sick Leave",
    icon: "medkit-outline",
    color: "#E53935",
  },
  {
    label: "Non paid Absence",
    value: "Non paid Absence",
    icon: "remove-circle-outline",
    color: "#757575",
  },
];

export default function LeaveTypeSelectionScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} />
      </TouchableOpacity>
      <Text style={styles.title}>Select Type of Leave</Text>
      <View style={styles.cardsContainer}>
        {leaveTypes.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.typeCard,
              selected === type.value && {
                borderColor: type.color,
                backgroundColor: "#f0f7ff",
              },
            ]}
            activeOpacity={0.85}
            onPress={() => setSelected(type.value)}
          >
            <Ionicons
              name={type.icon}
              size={36}
              color={type.color}
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.typeLabel}>{type.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.nextButton, !selected && { opacity: 0.5 }]}
        disabled={!selected}
        onPress={() =>
          router.push({
            pathname: "/(pto)/new-pto-request",
            params: { leaveType: selected },
          })
        }
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 24,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#082640",
    marginBottom: 30,
    alignSelf: "center",
  },
  cardsContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  typeCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 32,
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    shadowColor: "#1976D2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  typeLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#082640",
  },
  nextButton: {
    backgroundColor: "#082640",
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 60,
    alignSelf: "center",
    marginTop: 10,
    shadowColor: "#082640",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 400,
    letterSpacing: 1,
  },
});
