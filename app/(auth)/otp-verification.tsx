import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../components/CustomButton";
import OTPInput from "../../components/OTPInput";
import { verifyOTP } from "../../redux/actions/authActions";

export default function OTPVerificationScreen() {
  const dispatch = useDispatch();
  const { loading, error, tempEmail } = useSelector((state: any) => state.auth);

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 4) return;

    const success = await dispatch(verifyOTP(otp) as any);
    if (success) {
      router.push("/pin");
    }
  };

  const handleResendCode = () => {
    setTimeLeft(120);
    // In a real app, you would dispatch an action to resend the OTP
  };

  const maskedEmail = tempEmail
    ? tempEmail.replace(/(\w{3})(.*)(@.*)/, "$1***$3")
    : "your email";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>OTP Authentication</Text>
        <Text style={styles.subtitle}>
          An authentication has been sent to your email {maskedEmail}
        </Text>

        <View style={styles.otpContainer}>
          <OTPInput length={4} onOTPChange={setOtp} />
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            The code expires in: {formatTime()}
          </Text>
          <TouchableOpacity onPress={handleResendCode} disabled={timeLeft > 0}>
            <Text
              style={[styles.resendText, timeLeft > 0 && styles.disabledText]}
            >
              Send Code
            </Text>
          </TouchableOpacity>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Verify"
            onPress={handleVerifyOTP}
            loading={loading}
            disabled={otp.length !== 4}
          />
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
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  otpContainer: {
    width: "100%",
    marginBottom: 40,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  timerText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  resendText: {
    fontSize: 14,
    color: "#004B87",
    fontWeight: "bold",
  },
  disabledText: {
    opacity: 0.5,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
  },
});
