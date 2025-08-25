import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

const SubmitButton = ({
  onPress,
  title = "Submit",
  loading = false,
  disabled = false,
  icon = "send"
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <>
          <Icon name={icon} size={20} color="#fff" style={styles.icon} />
          <Text style={styles.text}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#002B49",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
    elevation: 0
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500"
  },
  icon: {
    marginRight: 8
  }
});

export default SubmitButton;
