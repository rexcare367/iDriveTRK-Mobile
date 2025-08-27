import BackgroundEffects from "@/components/BackgroundEffects";
import CustomInput from "@/components/CustomInput";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

export default function ChangePasswordScreen() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdatePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "New passwords do not match",
      });
      return;
    }

    if (formData.newPassword.length < 8) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Password must be at least 8 characters long",
      });
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        user.email!,
        formData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, formData.newPassword);

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Password updated successfully!",
      });
      router.back();
    } catch (error: any) {
      console.error("Failed to update password:", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody:
          error.message || "Failed to update password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundEffects />
      <Header title="Change Password" />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Password</Text>
          <View style={styles.inputContainer}>
            <CustomInput
              label="Current Password"
              value={formData.currentPassword}
              onChangeText={(value: string) =>
                handleChange("currentPassword", value)
              }
              placeholder="Enter current password"
              icon={
                <Ionicons name="lock-closed-outline" size={24} color="#666" />
              }
              secureTextEntry={!showCurrentPassword}
              togglePasswordVisibility={() =>
                setShowCurrentPassword(!showCurrentPassword)
              }
              isPassword
            />
          </View>

          <Text style={[styles.sectionTitle, styles.newPasswordTitle]}>
            New Password
          </Text>
          <View style={styles.inputContainer}>
            <CustomInput
              label="New Password"
              value={formData.newPassword}
              onChangeText={(value: string) =>
                handleChange("newPassword", value)
              }
              placeholder="Enter new password"
              icon={<Ionicons name="key-outline" size={24} color="#666" />}
              secureTextEntry={!showNewPassword}
              togglePasswordVisibility={() =>
                setShowNewPassword(!showNewPassword)
              }
              isPassword
            />
            <View style={styles.spacer} />
            <CustomInput
              label="Confirm New Password"
              value={formData.confirmPassword}
              onChangeText={(value: string) =>
                handleChange("confirmPassword", value)
              }
              placeholder="Confirm new password"
              icon={
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color="#666"
                />
              }
              secureTextEntry={!showConfirmPassword}
              togglePasswordVisibility={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              isPassword
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.updateButton, loading && styles.updateButtonDisabled]}
          onPress={handleUpdatePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.updateButtonText}>Update Password</Text>
          )}
        </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  newPasswordTitle: {
    marginTop: 32,
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  spacer: {
    height: 16,
  },
  section: {
    marginBottom: 24,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  updateButton: {
    backgroundColor: "#002B49",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
