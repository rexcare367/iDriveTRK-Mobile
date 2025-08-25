import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { updateUser } from "../../redux/actions/authActions";

interface FormData {
  firstName: string;
  lastName: string;
  emergency_contact: string;
  phone: string;
}

export default function ProfileDetailScreen() {
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  const { user } = useSelector((state: any) => state.auth);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    emergency_contact: user?.emergency_contact || "",
    phone: user?.phone || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const success = await dispatch(updateUser(formData));

      if (success) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Profile updated successfully!",
        });
        router.back();
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <CustomInput
            label="Email"
            value={user?.email}
            disabled={true}
            placeholder="Enter your first name"
            icon={<Ionicons name="person-outline" size={24} color="#666" />}
          />
          <CustomInput
            label="First Name"
            value={formData.firstName}
            onChangeText={(value: string) => handleChange("firstName", value)}
            placeholder="Enter your first name"
            icon={<Ionicons name="person-outline" size={24} color="#666" />}
          />
          <CustomInput
            label="Last Name"
            value={formData.lastName}
            onChangeText={(value: string) => handleChange("lastName", value)}
            placeholder="Enter your last name"
            icon={<Ionicons name="person-outline" size={24} color="#666" />}
          />
          <CustomInput
            label="Phone"
            value={formData.phone}
            onChangeText={(value: string) => handleChange("phone", value)}
            placeholder="Enter your phone number"
            icon={<Ionicons name="call-outline" size={24} color="#666" />}
          />
          <CustomInput
            label="Emergency Contact"
            value={formData.emergency_contact}
            onChangeText={(value: string) =>
              handleChange("emergency_contact", value)
            }
            placeholder="Enter your emergency_contact"
            icon={<Ionicons name="call-outline" size={24} color="#666" />}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <CustomButton
          title="Save Changes"
          onPress={handleSave}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
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
  securityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 12,
  },
  securityItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  securityItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  securityItemSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
});
