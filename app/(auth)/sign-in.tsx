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
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useDispatch, useSelector } from "react-redux";
import BackgroundEffects from "../../components/BackgroundEffects";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { signIn } from "../../redux/actions/authActions";

export default function SignInScreen() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: any) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Email and password are required",
      });
      return;
    }
    try {
      await dispatch(signIn(email, password) as any);

      // Check the current auth state from the component scope
      if (!loading && !error) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Sign In Success",
          textBody: "Please verify your OTP",
        });
        router.push("/pin");
      } else if (error) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Sign In Failed",
          textBody: error,
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Sign In Failed",
        textBody:
          error instanceof Error
            ? error.message
            : "An error occurred during sign in.",
      });
    }
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <BackgroundEffects />
        <View style={styles.header}>
          <Image
            source={require("../../assets/logo/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Log in here</Text>
          <Text style={styles.subtitle}>Welcome back, we missed you</Text>

          <CustomInput
            label="Email Address"
            placeholder="Enter your email here"
            value={email}
            onChangeText={setEmail}
            icon={<Ionicons name="person-outline" size={24} color="#666" />}
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

          <View style={styles.rememberContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              >
                {rememberMe && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text style={styles.rememberText}>Keep me signed in</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/forgot-password")}>
              <Text style={styles.forgotPassword}>Forgot Password</Text>
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <CustomButton
            title="Log in"
            onPress={handleSignIn}
            loading={loading}
          />

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Do not have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signupLink}>Sign up</Text>
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
    justifyContent: "flex-end",
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
  rememberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#004B87",
    borderColor: "#004B87",
  },
  rememberText: {
    fontSize: 14,
    color: "#333",
  },
  forgotPassword: {
    fontSize: 14,
    color: "#004B87",
    fontStyle: "italic",
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
