import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PinKeypadProps {
  onKeyPress?: (key: string) => void;
  onComplete?: (pin: string) => void;
  pinLength?: number;
}
export const PinKeypad = ({
  onKeyPress,
  onComplete,
  pinLength = 4,
}: PinKeypadProps) => {
  const [pin, setPin] = useState<any>([]);

  const handleKeyPress = (key: any) => {
    if (onKeyPress) {
      onKeyPress(key);
      return;
    }

    if (key === "backspace") {
      setPin((prevPin: any) => {
        const newPin = prevPin.slice(0, -1);
        return newPin;
      });
    } else if (pin.length < pinLength) {
      setPin((prevPin: any) => {
        const newPin = [...prevPin, key];
        if (newPin.length === pinLength && onComplete) {
          onComplete(newPin.join(""));
          setPin([]);
        }
        return newPin;
      });
    }
  };
  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "backspace"],
  ];

  const renderKey = (key: any) => {
    if (key === "backspace") {
      return (
        <TouchableOpacity
          key={key}
          style={styles.key}
          onPress={() => handleKeyPress(key)}
        >
          <Ionicons name="backspace-outline" size={28} color="red" />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          key={key}
          style={styles.key}
          onPress={() => handleKeyPress(key)}
        >
          <Text style={styles.keyText}>{key}</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((key) => renderKey(key))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  key: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  keyText: {
    fontSize: 28,
    fontWeight: "bold",
  },
});
