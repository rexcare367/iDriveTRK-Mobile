import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useDispatch, useSelector } from "react-redux";
import { PinKeypad } from "../../components/PinKeypad";
import {
  createPIN,
  logout,
  signIn,
  verifyPIN,
} from "../../redux/actions/authActions";

export default function PinScreen() {
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state: any) => state.auth);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          console.log("userObj", userObj);
          // Fetch full user info from backend
          dispatch(signIn(userObj.email, userObj.password) as any);
        } else {
          router.replace("/sign-in");
        }
      } catch (err) {
        router.replace("/sign-in");
      }
    };
    loadUser();
  }, []);

  console.log("user", user);
  const hasPin = !!user?.pin;

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      if (currentIndex > 0 || (currentIndex === 3 && pin[3] !== "")) {
        const newPin = [...pin];
        if (currentIndex === 3 && pin[3] !== "") {
          newPin[3] = "";
          setPin(newPin);
          setCurrentIndex(3);
        } else {
          newPin[currentIndex - 1] = "";
          setPin(newPin);
          setCurrentIndex(currentIndex - 1);
        }
      }
    } else {
      if (currentIndex < 4) {
        const newPin = [...pin];
        newPin[currentIndex] = key;
        setPin(newPin);

        if (currentIndex < 3) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setTimeout(() => {
            handleSubmitPin(newPin.join(""));
          }, 300);
        }
      }
    }
  };

  const handleSubmitPin = async (pinValue: string) => {
    let success;
    if (hasPin) {
      success = await dispatch(verifyPIN(pinValue) as any);
      if (success) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "PIN verified! You are now logged in.",
        });
        router.push("/home");
      }
    } else {
      success = await dispatch(createPIN(pinValue) as any);
      if (success) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "PIN created successfully! You are now logged in.",
        });
        router.push("/home");
      }
    }
    if (!success) {
      setPin(["", "", "", ""]);
      setCurrentIndex(0);
    }
  };

  const handleLogout = () => {
    dispatch(logout() as any);
    router.push("/sign-in");
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#004B87" />
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.profileContainer}>
          <Image
            source={
              user?.avatar
                ? { uri: user?.avatar }
                : require("../../assets/profile-placeholder.png")
            }
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.title}>
          {hasPin ? "Enter Your Pin" : "Create Four Digit Pin"}
        </Text>
        <Text style={styles.subtitle}>
          {hasPin
            ? "Enter your 4-Digit Pin to continue"
            : "Enter your 4-Digit Pin"}
        </Text>

        <View style={styles.pinContainer}>
          {pin.map((digit, index) => (
            <View key={index} style={styles.pinDigit}>
              <Text style={styles.pinText}>{digit || "-"}</Text>
            </View>
          ))}
        </View>

        <PinKeypad onKeyPress={handleKeyPress} />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.logoutContainer}>
          <Text style={styles.logoutText}>Not your account? </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.logoutLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    marginBottom: 24,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#004B87",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
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
  errorText: {
    color: "red",
    marginTop: 20,
  },
  logoutContainer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 14,
    color: "#333",
  },
  logoutLink: {
    fontSize: 14,
    color: "#004B87",
    fontWeight: "bold",
  },
});
