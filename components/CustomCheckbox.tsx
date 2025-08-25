import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ICheckbox {
  checked?: boolean;
  onPress?: any;
  label?: any;
  style?: any;
  labelStyle?: any;
}

const Checkbox = ({
  checked,
  onPress,
  label,
  style,
  labelStyle,
}: ICheckbox) => (
  <TouchableOpacity
    style={[styles.container, style]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.box, checked && styles.checkedBox]}>
      {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
    </View>
    {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#666",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  checkedBox: {
    backgroundColor: "#082640",
    borderColor: "#082640",
  },
  label: {
    fontSize: 16,
    color: "#222",
  },
});

export default Checkbox;
