import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: any;
  iconColor?: string;
  text?: string;
  subtext?: string;
}

const EmptyState = ({
  icon = "alarm-outline",
  iconSize = 48,
  iconColor = "#ccc",
  text = "No data available",
  subtext = "Check back later",
}: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={iconSize} color={iconColor} />
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.subtext}>{subtext}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 56,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
  },
  subtext: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 4,
  },
});

export default EmptyState;
