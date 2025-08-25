import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatCardProps {
  title: any;
  value: any;
  subtitle?: any;
  iconName: any;
  backgroundColor?: string;
  textColor?: string;
}

const StatCard = ({
  title,
  value,
  subtitle,
  iconName,
  backgroundColor = "#002B49",
  textColor = "white",
}: StatCardProps) => {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={24} color={textColor} />
      </View>
      <Text style={[styles.value, { color: textColor }]}>{value}</Text>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: textColor }]}>{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    flex: 1,
    minHeight: 120,
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.8,
  },
});

export default StatCard;
