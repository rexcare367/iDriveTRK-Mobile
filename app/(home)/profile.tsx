import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/Header";
import { logout, switchScheduler } from "@/redux/actions/authActions";
import { switchUserRole } from "@/redux/actions/userActions";
import { api } from "@/utils";
import { useDispatch, useSelector } from "react-redux";

export default function ProfileScreen() {
  const dispatch = useDispatch();

  const { user, loading, currentScheduler } = useSelector((state: any) => state.auth);
  const isManager = user?.employeeRole === "MANAGER";

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ uri: string } | null>(
    null
  );

  // Scheduler selection state
  const [schedulerModalVisible, setSchedulerModalVisible] = useState(false);
  const [selectedSchedulerId, setSelectedSchedulerId] = useState<string | null>(currentScheduler);

  // Get current scheduler object
  const getCurrentScheduler = () => {
    if (!user?.schedulers || user.schedulers.length === 0) return null;

    if (currentScheduler) {
      const scheduler = user.schedulers.find((s: any) => s.id === currentScheduler);
      if (scheduler) return scheduler;
    }

    return user.schedulers[0] || null;
  };

  const currentSchedulerObj = getCurrentScheduler();

  const handleRoleSwitch = () => {
    const newRole = isManager ? "EMPLOYEE" : "MANAGER";
    dispatch(switchUserRole(newRole));
  };

  const handleLogout = () => {
    (dispatch as any)(logout());
    router.push("/(auth)/sign-in");
  };

  const handlePayment = () => {
    //   router.push("/(app)/payroll");
  };

  const handleEditPicture = () => {
    setModalVisible(true);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleContinue = async () => {
    if (!selectedImage) {
      Alert.alert("No Image Selected", "Please select an image first.");
      return;
    }

    try {
      // Fetch the image content from URI to get actual file data
      // Convert the local file URI to a blob
      const response = await fetch(selectedImage.uri);
      const blob = await response.blob();
      const filename = `profile-photo-${Date.now()}.png`;

      const formData = new FormData();
      formData.append("file", blob, filename);

      // Upload image to server using the correct endpoint format
      // Following the Next.js pattern: send the file directly with proper Content-Type
      const uploadResponse = await api.post(
        `/api/users/${user?.id}/upload-photo?filename=${filename}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      const { success } = uploadResponse.data;

      if (success) {
        // Update user with new avatar URL if needed
        setModalVisible(false);
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody:
            "Profile photo updated successfully! You can see it after sign-in again",
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody:
            uploadResponse.data.message || "Failed to upload profile photo.",
        });
      }
    } catch (error) {
      console.error("Failed to upload profile photo:", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Failed to upload profile photo. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const handleSchedulerSelect = (schedulerId: string) => {
    setSelectedSchedulerId(schedulerId);
  };

  const handleSchedulerSwitch = async () => {
    if (!selectedSchedulerId) return;

    try {
      const result = await (dispatch as any)(switchScheduler(selectedSchedulerId));

      if (result) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Scheduler switched successfully!",
        });
        setSchedulerModalVisible(false);
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Failed to switch scheduler. Please try again.",
        });
      }
    } catch (error) {
      console.error("Failed to switch scheduler:", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Failed to switch scheduler. Please try again.",
      });
    }
  };

  const openSchedulerModal = () => {
    setSelectedSchedulerId(currentScheduler);
    setSchedulerModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" subtitle="Manage your account settings" />

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                user?.avatar
                  ? { uri: user?.avatar }
                  : require("@/assets/logo/logo.png")
              }
              style={styles.profileImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.editPictureOverlay}
              onPress={handleEditPicture}
            >
              <Ionicons name="camera" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => router.push("/(home)/profile-detail")}
          >
            <Text style={styles.editProfileText}>Edit Profile Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          {/* Account Settings */}
          <View style={styles.settingGroup}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.roleInfo}>
                <Ionicons
                  name={isManager ? "people" : "person"}
                  size={24}
                  color="#666"
                />
                <Text style={styles.settingTitle}>
                  {isManager ? "Manager Mode" : "Employee Mode"}
                </Text>
              </View>
              <Switch
                trackColor={{ false: "#767577", true: "#cce5ff" }}
                thumbColor={isManager ? "#002B49" : "#f4f3f4"}
                ios_backgroundColor="#767577"
                onValueChange={handleRoleSwitch}
                value={isManager}
              />
            </TouchableOpacity>

            {/* Scheduler Selection */}
            
              <TouchableOpacity
                style={styles.settingItem}
                onPress={openSchedulerModal}
              >
                <Ionicons name="business-outline" size={24} color="#666" />
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Current Scheduler</Text>
                  <Text style={styles.settingSubtitle}>
                    {currentSchedulerObj?.title || "Select Scheduler"}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
          </View>

          {/* Features */}
          <View style={styles.settingGroup}>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="notifications-outline" size={24} color="#666" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingSubtitle}>
                  Manage notification preferences
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handlePayment}
            >
              <Ionicons name="wallet-outline" size={24} color="#666" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Payment Settings</Text>
                <Text style={styles.settingSubtitle}>
                  Manage your payment information
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="help-circle-outline" size={24} color="#666" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingSubtitle}>
                  Get assistance and support
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Security Settings */}
          <View style={styles.settingGroup}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => router.push("/(home)/change-password")}
            >
              <Ionicons name="lock-closed-outline" size={24} color="#666" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Change Password</Text>
                <Text style={styles.settingSubtitle}>
                  Update your account password
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingItem, { borderBottomWidth: 0 }]}
              onPress={() => router.push("/(home)/change-pin")}
            >
              <Ionicons name="keypad-outline" size={24} color="#666" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Change PIN</Text>
                <Text style={styles.settingSubtitle}>Update your PIN code</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Logout */}
          <TouchableOpacity
            style={styles.logoutItem}
            onPress={() => handleLogout()}
          >
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <View style={styles.settingContent}>
              <Text style={styles.logoutTitle}>Log out</Text>
              <Text style={styles.settingSubtitle}>Exit from your account</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Profile Picture Upload Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Profile Picture</Text>
              <TouchableOpacity
                onPress={handleCancel}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {selectedImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: selectedImage.uri }}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity
                    style={styles.changeImageButton}
                    onPress={pickImage}
                  >
                    <Text style={styles.changeImageText}>Change Image</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={48}
                    color="#666"
                  />
                  <Text style={styles.uploadText}>Select Profile Picture</Text>
                  <Text style={styles.uploadSubtext}>
                    Tap to choose from your gallery
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.continueModalButton,
                  !selectedImage && styles.disabledButton,
                ]}
                onPress={handleContinue}
                disabled={!selectedImage || loading}
              >
                <Text style={styles.continueModalButtonText}>
                  {loading ? "Uploading..." : "Continue"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Scheduler Selection Modal */}
      <Modal
        visible={schedulerModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSchedulerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Scheduler</Text>
              <TouchableOpacity
                onPress={() => setSchedulerModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.schedulerList}>
              {user?.schedulers?.map((scheduler: any) => (
                <TouchableOpacity
                  key={scheduler.id}
                  style={[
                    styles.schedulerItem,
                    selectedSchedulerId === scheduler.id && styles.selectedSchedulerItem,
                  ]}
                  onPress={() => handleSchedulerSelect(scheduler.id)}
                >
                  <View style={styles.schedulerInfo}>
                    <Ionicons
                      name="business-outline"
                      size={24}
                      color={selectedSchedulerId === scheduler.id ? "#007AFF" : "#666"}
                    />
                    <View style={styles.schedulerDetails}>
                      <Text
                        style={[
                          styles.schedulerTitle,
                          selectedSchedulerId === scheduler.id && styles.selectedSchedulerTitle,
                        ]}
                      >
                        {scheduler.title}
                      </Text>
                      <Text style={styles.schedulerStatus}>
                        Status: {scheduler.status}
                      </Text>
                    </View>
                  </View>
                  {selectedSchedulerId === scheduler.id && (
                    <Ionicons name="checkmark" size={24} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setSchedulerModalVisible(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.continueModalButton]}
                onPress={handleSchedulerSwitch}
                disabled={!selectedSchedulerId}
              >
                <Ionicons name="arrow-forward" size={16} color="#fff" />
                <Text
                  style={[
                    styles.continueModalButtonText,
                    !selectedSchedulerId && styles.disabledButtonText,
                  ]}
                >
                  Switch
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  content: {
    flex: 1,
  },

  profileActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    gap: 12,
  },
  editProfileButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#002B49",
  },
  editProfileText: {
    fontSize: 14,
    color: "#fff",
  },
  backButton: {
    padding: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#f8f8f8",
    marginBottom: 16,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },
  editPictureOverlay: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#002B49",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#002B49",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    lineHeight: 20,
  },
  settingsSection: {
    padding: 16,
  },
  settingGroup: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  roleInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 12,
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff3f3",
    borderRadius: 12,
    marginTop: 24,
  },
  logoutTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 380,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    position: "relative",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#002B49",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
  },
  modalBody: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: "center",
  },
  imagePreviewContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#002B49",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  changeImageButton: {
    backgroundColor: "#002B49",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  changeImageText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  uploadArea: {
    width: "100%",
    height: 160,
    borderWidth: 2,
    borderColor: "#e1e5e9",
    borderStyle: "dashed",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fafbfc",
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#002B49",
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
    fontWeight: "500",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 12,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueModalButton: {
    backgroundColor: "#002B49",
  },
  cancelModalButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e1e5e9",
  },
  continueModalButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  cancelModalButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
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
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  // Scheduler Modal Styles
  schedulerList: {
    maxHeight: 280,
    paddingHorizontal: 4,
  },
  schedulerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f5f5f5",
  },
  selectedSchedulerItem: {
    backgroundColor: "#f8fbff",
    borderColor: "#007AFF",
    borderWidth: 2,
    shadowColor: "#007AFF",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  schedulerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  schedulerDetails: {
    marginLeft: 16,
    flex: 1,
  },
  schedulerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#002B49",
    marginBottom: 4,
  },
  selectedSchedulerTitle: {
    color: "#007AFF",
    fontWeight: "700",
  },
  schedulerStatus: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  disabledButtonText: {
    color: "#ccc",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 12,
  },
});
