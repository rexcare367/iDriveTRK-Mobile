import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { TouchableOpacity, Image, StyleSheet, Text, View } from "react-native";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import BackgroundEffects from "../../components/BackgroundEffects";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { auth } from "../../firebase/config";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Please enter your email address",
      });
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody:
          "Please check your email inbox for password reset instructions",
      });
      router.replace("/sign-in");
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundEffects />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Image
          source={require("../../assets/logo/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email to reset your password
        </Text>

        <CustomInput
          label="Email Address"
          placeholder="Enter your email here"
          value={email}
          onChangeText={setEmail}
          icon={<Ionicons name="person-outline" size={24} color="#666" />}
        />
      </View>
      <View style={styles.footer}>
        <CustomButton
          title="Reset Password"
          onPress={handleResetPassword}
          loading={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    width: "100%",
  },
  backButton: {
    padding: 5,
  },
  logo: {
    width: 86,
    height: 44,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
});
