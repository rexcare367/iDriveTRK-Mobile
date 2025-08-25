import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BackgroundEffects from "../../components/BackgroundEffects";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { signUp } from "../../redux/actions/authActions";

export default function SignUpScreen() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: any) => state.auth);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");
    await dispatch(signUp(email, phone, password) as any);
    router.push("/setup-account");
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          <Text style={styles.title}>Getting Started</Text>
          <Text style={styles.subtitle}>Create an account here</Text>

          <CustomInput
            label="Email Address"
            placeholder="Enter your email here"
            value={email}
            onChangeText={setEmail}
            icon={<Ionicons name="mail-outline" size={24} color="#666" />}
          />

          <CustomInput
            label="Phone Number"
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            icon={<Ionicons name="call-outline" size={24} color="#666" />}
          />

          <CustomInput
            label="Password"
            placeholder="Enter password here"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            icon={
              <Ionicons name="lock-closed-outline" size={24} color="#666" />
            }
            togglePasswordVisibility={togglePasswordVisibility}
            isPassword
          />

          <CustomInput
            label="Confirm Password"
            placeholder="Enter password here"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            icon={
              <Ionicons name="lock-closed-outline" size={24} color="#666" />
            }
            togglePasswordVisibility={toggleConfirmPasswordVisibility}
            isPassword
          />

          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          {error && <Text style={styles.errorText}>{error}</Text>}

          <CustomButton title="Next" onPress={handleSignUp} loading={loading} />

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={styles.signupLink}>Log in</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.orContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="apple" size={24} color="black" />
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require("../../assets/logo/google-icon.png")}
                style={styles.googleIcon}
              />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
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
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signupText: {
    fontSize: 14,
    color: "#333",
  },
  signupLink: {
    fontSize: 14,
    color: "#004B87",
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    paddingHorizontal: 10,
    color: "#666",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "white",
  },
  socialText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
});
