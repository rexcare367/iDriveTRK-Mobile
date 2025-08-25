import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const EmptyState = ({
  icon = "clock",
  iconSize = 48,
  iconColor = "#ccc",
  text = "No data available",
  subtext = "Check back later",
}) => {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={iconSize} color={iconColor} />
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
