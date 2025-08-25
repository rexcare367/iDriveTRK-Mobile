import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ICustomInut {
  label: any;
  placeholder: string;
  value: string;
  onChangeText?: any;
  secureTextEntry?: boolean;
  icon: any;
  togglePasswordVisibility?: any;
  isPassword?: boolean;
  disabled?: boolean;
  type?: any;
}

const CustomInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  icon,
  togglePasswordVisibility,
  isPassword = false,
  disabled = false,
  type,
}: ICustomInut) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toLocaleDateString();
      onChangeText(formatted);
    }
  };

  const handleTimeChange = (event: any, selectedTime: any) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const formatted = selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      onChangeText(formatted);
    }
  };

  const handleDateTimeChange = (event: any, selectedDateTime: any) => {
    setShowDatePicker(false);
    if (selectedDateTime) {
      const formatted = `${selectedDateTime.toLocaleDateString()} ${selectedDateTime.toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      )}`;
      onChangeText(formatted);
    }
  };

  const formatDisplayDate = (dateString: any) => {
    if (!dateString) return getTodayString();
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString();
  };

  const formatDisplayTime = (timeString: any) => {
    if (!timeString) return "--:--";
    const date = new Date(`1970-01-01T${timeString}`);
    if (isNaN(date.getTime())) {
      return timeString;
    }
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDisplayDateTime = (dateTimeString: any) => {
    if (!dateTimeString) return `${getTodayString()} --:--`;
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
      return dateTimeString;
    }
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
        ]}
      >
        <View style={styles.iconContainer}>{icon}</View>
        <View style={styles.divider} />
        {type === "date" ? (
          <>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.input,
                  {
                    color: value ? "#000" : "#aaa",
                    textAlign: "center",
                    textAlignVertical: "center",
                  },
                ]}
              >
                {formatDisplayDate(value)}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={
                  value && !isNaN(new Date(value).getTime())
                    ? new Date(value)
                    : new Date()
                }
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </>
        ) : type === "time" ? (
          <>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.input,
                  {
                    color: value ? "#000" : "#aaa",
                    textAlign: "center",
                    textAlignVertical: "center",
                  },
                ]}
              >
                {formatDisplayTime(value)}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={
                  value && !isNaN(new Date(`1970-01-01T${value}`).getTime())
                    ? new Date(`1970-01-01T${value}`)
                    : new Date()
                }
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </>
        ) : type === "datetime" ? (
          <>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.input,
                  {
                    color: value ? "#000" : "#aaa",
                    textAlign: "center",
                    textAlignVertical: "center",
                  },
                ]}
              >
                {formatDisplayDateTime(value)}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={
                  value && !isNaN(new Date(value).getTime())
                    ? new Date(value)
                    : new Date()
                }
                mode="datetime"
                display="default"
                onChange={handleDateTimeChange}
              />
            )}
          </>
        ) : (
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
            editable={!disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        )}
        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    height: 56,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
  },
  inputContainerFocused: {
    backgroundColor: "#F4FAFF",
    borderColor: "#082640",
  },
  iconContainer: {
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: "#ccc",
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#222",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
});

export default CustomInput;
