import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MapPlaceholderProps {
  style?: any;
  children?: React.ReactNode;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ style, children }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>Map View</Text>
      <Text style={styles.subtext}>Development build required for maps</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
  },
  subtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
});

export default MapPlaceholder;
