import BackgroundEffects from "@/components/BackgroundEffects";
import Header from "@/components/Header";
import { PinKeypad } from "@/components/PinKeypad";
import { createPIN, verifyPIN } from "@/redux/actions/authActions";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

export default function ChangePinScreen() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"current" | "new" | "confirm">("current");
  const [currentPin, setCurrentPin] = useState(["", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleKeyPress = (key: string) => {
    let currentPinArray: string[];
    let setCurrentPinArray: React.Dispatch<React.SetStateAction<string[]>>;

    switch (step) {
      case "current":
        currentPinArray = currentPin;
        setCurrentPinArray = setCurrentPin;
        break;
      case "new":
        currentPinArray = newPin;
        setCurrentPinArray = setNewPin;
        break;
      case "confirm":
        currentPinArray = confirmPin;
        setCurrentPinArray = setConfirmPin;
        break;
    }

    if (key === "backspace") {
      if (
        currentIndex > 0 ||
        (currentIndex === 3 && currentPinArray[3] !== "")
      ) {
        const newPinArray = [...currentPinArray];
        if (currentIndex === 3 && currentPinArray[3] !== "") {
          newPinArray[3] = "";
          setCurrentPinArray(newPinArray);
          setCurrentIndex(3);
        } else {
          newPinArray[currentIndex - 1] = "";
          setCurrentPinArray(newPinArray);
          setCurrentIndex(currentIndex - 1);
        }
      }
    } else {
      if (currentIndex < 4) {
        const newPinArray = [...currentPinArray];
        newPinArray[currentIndex] = key;
        setCurrentPinArray(newPinArray);

        if (currentIndex < 3) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setTimeout(() => {
            handlePinComplete(newPinArray.join(""));
          }, 300);
        }
      }
    }
  };

  const handlePinComplete = async (pin: string) => {
    if (step === "current") {
      setLoading(true);
      try {
        const success = await dispatch(verifyPIN(pin) as any);
        if (success) {
          setStep("new");
          setCurrentIndex(0);
        } else {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: "Incorrect PIN. Please try again.",
          });
          setCurrentPin(["", "", "", ""]);
          setCurrentIndex(0);
        }
      } catch (error: any) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: error.message || "Failed to verify PIN. Please try again.",
        });
        setCurrentPin(["", "", "", ""]);
        setCurrentIndex(0);
      } finally {
        setLoading(false);
      }
    } else if (step === "new") {
      setStep("confirm");
      setCurrentIndex(0);
    } else {
      handleSave(pin);
    }
  };

  const handleSave = async (confirmedPin: string) => {
    if (newPin.join("") !== confirmedPin) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "PINs do not match. Please try again.",
      });
      // Reset to new PIN input
      setStep("new");
      setNewPin(["", "", "", ""]);
      setConfirmPin(["", "", "", ""]);
      setCurrentIndex(0);
      return;
    }

    try {
      setLoading(true);
      const success = await dispatch(createPIN(confirmedPin) as any);
      if (success) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "PIN updated successfully!",
        });
        router.back();
      }
    } catch (error) {
      console.error("Failed to update PIN:", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody:
          "Failed to update PIN. Please check your current PIN and try again.",
      });
      // Reset to first step
      setStep("current");
      setCurrentPin(["", "", "", ""]);
      setNewPin(["", "", "", ""]);
      setConfirmPin(["", "", "", ""]);
      setCurrentIndex(0);
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "current":
        return "Enter Current PIN";
      case "new":
        return "Enter New PIN";
      case "confirm":
        return "Confirm New PIN";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundEffects />
      <Header title="Change PIN" />

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${step === "current" ? 33 : step === "new" ? 66 : 100}%`,
            },
          ]}
        />
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#002B49" />
            <Text style={styles.loadingText}>Updating PIN...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.title}>{getStepTitle()}</Text>
            <Text style={styles.subtitle}>
              {step === "current"
                ? "Enter your current PIN to continue"
                : step === "new"
                ? "Enter your new 4-digit PIN"
                : "Re-enter your new 4-digit PIN"}
            </Text>

            <View style={styles.pinContainer}>
              {(step === "current"
                ? currentPin
                : step === "new"
                ? newPin
                : confirmPin
              ).map((digit, index) => (
                <View
                  key={index}
                  style={[
                    styles.pinDigit,
                    {
                      borderColor: index === currentIndex ? "#004B87" : "#ccc",
                    },
                  ]}
                >
                  <Text style={styles.pinText}>{digit || "-"}</Text>
                </View>
              ))}
            </View>

            <PinKeypad
              onKeyPress={handleKeyPress}
              onComplete={() => {}}
              pinLength={4}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    width: "100%",
    height: 4,
    backgroundColor: "#f0f0f0",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#004B87",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#002B49",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 40,
  },
  pinDigit: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  pinText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});
