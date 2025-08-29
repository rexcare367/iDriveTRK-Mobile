import checkAnimation from "@/assets/lottie/check.json";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import moment from "moment";
import { useRef, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Signature from "react-native-signature-canvas";
import ViewShot from "react-native-view-shot";
import { useDispatch, useSelector } from "react-redux";

import BackgroundEffects from "@/components/BackgroundEffects";
import BottomTabBar from "@/components/BottomTabBar";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import Header from "@/components/Header";
import { clockOut, completePostTrip } from "@/redux/actions/driverActions";
import { api } from "@/utils";

const PostTripFormSignature = () => {
  const dispatch = useDispatch();
  const { user, postTripFormData, clockInFormData } = useSelector(
    (state: any) => state.driver
  );

  const signatureRef = useRef(null);
  const typedSignatureViewRef = useRef(null);

  const [formData, setFormData] = useState<any>({
    signatureText: postTripFormData?.signature?.signatureText || "",
    signatureType: postTripFormData?.signature?.signatureType || "typing",
    drawnSignature: postTripFormData?.signature?.drawnSignature || "",
    typedSignature: postTripFormData?.signature?.typedSignature || "",
  });
  const [signatureKey, setSignatureKey] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSubmitDisabled =
    !formData.signatureText ||
    (!formData.drawnSignature && !formData.typedSignature);

  const handleSubmit = async () => {
    setLoading(true);
    let typedSignatureImage = formData.typedSignatureImage || "";
    if (formData.signatureType === "typing" && typedSignatureViewRef.current) {
      try {
        typedSignatureImage = await typedSignatureViewRef.current.capture();
      } catch (e) {
        console.warn("Failed to capture typed signature image", e);
      }
    }

    const updatedPostTripFormData = {
      ...postTripFormData,
      signature: {
        signatureType: formData.signatureType,
        typedSignature: formData.typedSignature,
        signatureText: formData.signatureText,
        drawnSignature: formData.drawnSignature,
        typedSignatureImage,
      },
    };

    const userId = user?.id;
    const schedule_id = clockInFormData?.schedule_id;

    // Call backend API to store post-trip inspection
    await api.post("api/truck-inspection", {
      userId,
      ...updatedPostTripFormData,
    });

    // Update schedule status to 'completed'
    await api.patch(`api/schedules/${schedule_id}`, {
      status: "completed",
    });
    dispatch(completePostTrip(updatedPostTripFormData));

    setLoading(false);
    setShowSuccessModal(true);
    await handleClockOut();
  };

  const handleSignature = (signature: any) => {
    setFormData({ ...formData, drawnSignature: signature });
  };

  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clearSignature();
    }
    setFormData({ ...formData, drawnSignature: "" });
    setSignatureKey((prev) => prev + 1);
  };

  const handleSignatureTypeChange = (type: any) => {
    setFormData({
      ...formData,
      signatureType: type,
      typedSignature: "",
      drawnSignature: "",
    });
  };

  const handleClockOut = async () => {
    try {
      const clockOutData = {
        clockout_time: moment().toISOString(),
        status: "clockOut",
      };

      const apiResult = await api.patch(
        `api/timesheets/by-id/${clockInFormData.id}`,
        clockOutData
      );

      if (apiResult?.data?.success || apiResult?.status === 200) {
        dispatch(clockOut());
      } else {
        console.error("Failed to save clock-out data", apiResult);
      }
    } catch (error) {
      console.error("Error during clock-out:", error);
    }
  };

  const progressSteps = [
    "Driver Info",
    "Vehicle Info",
    "Photos",
    "Engine",
    "Fluids",
    "Wheels",
    "Rear",
    "Cab",
    "Lights",
    "Checklist",
    "Safety",
    "Trailer",
    "Trailer Details",
    "Signature",
  ];

  const renderProgressBar = () => {
    return (
      <View style={styles.progressContainer}>
        {progressSteps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressStep,
              index <= 13
                ? styles.progressStepActive
                : styles.progressStepInactive,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundEffects />
      <Header
        title="Signature"
        subtitle="Sign your signature and submit form"
      />

      <ScrollView style={styles.content}>
        {renderProgressBar()}

        <View style={styles.inputContainer}>
          <CustomInput
            label={
              <>
                Signature (Typed)
                <Text style={{ color: "#B70101" }}>*</Text>
              </>
            }
            placeholder="Enter your name here"
            value={formData.signatureText}
            onChangeText={(text: string) =>
              setFormData({ ...formData, signatureText: text })
            }
            icon={<Ionicons name="person-outline" size={20} color="#082640" />}
          />
        </View>

        <View style={styles.signatureContainerOuter}>
          <View style={styles.signatureTypeContainer}>
            <TouchableOpacity
              style={[
                styles.signatureTypeButton,
                formData.signatureType === "typing" &&
                  styles.signatureTypeButtonActive,
              ]}
              onPress={() => handleSignatureTypeChange("typing")}
            >
              <Text
                style={[
                  styles.signatureTypeText,
                  formData.signatureType === "typing" &&
                    styles.signatureTypeTextActive,
                ]}
              >
                Type Signature
              </Text>
              {formData.signatureType === "typing" && (
                <View style={styles.tabUnderline} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.signatureTypeButton,
                formData.signatureType === "draw" &&
                  styles.signatureTypeButtonActive,
              ]}
              onPress={() => handleSignatureTypeChange("draw")}
            >
              <Text
                style={[
                  styles.signatureTypeText,
                  formData.signatureType === "draw" &&
                    styles.signatureTypeTextActive,
                ]}
              >
                Draw Signature
              </Text>
              {formData.signatureType === "draw" && (
                <View style={styles.tabUnderline} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.signatureBox}>
            {formData.signatureType === "draw" ? (
              <>
                {formData.drawnSignature ? (
                  <View style={{ flex: 1, width: "100%" }}>
                    <Image
                      source={{ uri: formData.drawnSignature }}
                      style={{
                        width: "100%",
                        height: 180,
                        backgroundColor: "#fff",
                      }}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <View style={{ flex: 1, width: "100%" }}>
                    <Signature
                      key={signatureKey}
                      ref={signatureRef}
                      onOK={handleSignature}
                      onClear={handleClearSignature}
                      descriptionText="Sign"
                      clearText="Clear"
                      confirmText="Save"
                      autoClear={false}
                      backgroundColor="#fff"
                      penColor="#000"
                      style={{ height: 180, width: "100%" }}
                    />
                    <View style={styles.signatureButtonsContainer}>
                      <TouchableOpacity
                        style={styles.signatureButton}
                        onPress={handleClearSignature}
                      >
                        <Text style={styles.signatureButtonText}>Clear</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.signatureButton, styles.saveButton]}
                        onPress={() => {
                          if (signatureRef.current) {
                            signatureRef.current.readSignature();
                          }
                        }}
                      >
                        <Text
                          style={[
                            styles.signatureButtonText,
                            styles.saveButtonText,
                          ]}
                        >
                          Save
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </>
            ) : (
              <>
                <View style={styles.typedSignatureRow}>
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() =>
                      setFormData({ ...formData, typedSignature: "" })
                    }
                  >
                    <Ionicons name="close" size={24} color="#000" />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.typedSignatureInput}
                    value={formData.typedSignature}
                    onChangeText={(text: string) =>
                      setFormData({ ...formData, typedSignature: text })
                    }
                    placeholder="Type your signature"
                    placeholderTextColor="#bbb"
                    underlineColorAndroid="transparent"
                  />
                </View>
                <ViewShot
                  ref={typedSignatureViewRef}
                  options={{ format: "png", quality: 1, result: "data-uri" }}
                  style={styles.signaturePreviewContainer}
                >
                  <Text
                    style={[
                      styles.signaturePreview,
                      !formData.typedSignature && { color: "#bbb" },
                    ]}
                  >
                    {formData.typedSignature || "Your Signature"}
                  </Text>
                  <View style={styles.signatureLine} />
                </ViewShot>
              </>
            )}
          </View>
          <View style={styles.signatureDivider} />
          <Text style={styles.signatureBoxCaption}>
            {formData.signatureType === "draw"
              ? "Draw Your Signature"
              : "Type Your Signature"}
          </Text>
        </View>

        <CustomButton
          title="Submit"
          onPress={handleSubmit}
          disabled={isSubmitDisabled}
          loading={loading}
        />
      </ScrollView>

      <BottomTabBar activeTab="Home" />

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 24,
              alignItems: "center",
              width: 320,
              maxWidth: "90%",
            }}
          >
            <LottieView
              source={checkAnimation}
              autoPlay
              loop={false}
              style={{ width: 164, height: 164 }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Post Trip Successfully Submitted
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#444",
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Congratulations you have successfully checked in on your post trip
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#082640",
                borderRadius: 6,
                paddingVertical: 12,
                paddingHorizontal: 32,
                width: "100%",
              }}
              onPress={async () => {
                setShowSuccessModal(false);

                router.push("/(home)/home");
              }}
            >
              <Text
                style={{ color: "white", fontSize: 16, textAlign: "center" }}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    marginTop: 10,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  progressStep: {
    height: 4,
    flex: 1,
    marginHorizontal: 2,
  },
  progressStepActive: {
    backgroundColor: "#082640",
  },
  progressStepInactive: {
    backgroundColor: "#D3D3D3",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  signatureContainerOuter: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
    marginTop: 8,
  },
  signatureTypeContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  signatureTypeButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    position: "relative",
    backgroundColor: "#fff",
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: "15%",
    right: "15%",
    height: 3,
    backgroundColor: "#1A3143",
    borderRadius: 2,
  },
  signatureTypeText: {
    fontSize: 14,
    color: "#999",
  },
  signatureTypeTextActive: {
    color: "#1A3143",
    fontWeight: "500",
  },
  signatureBox: {
    height: 220,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    padding: 16,
    position: "relative",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 0,
    marginBottom: 0,
  },
  clearButtonText: {
    fontSize: 18,
    marginLeft: 5,
    color: "#000",
  },
  signatureDivider: {
    height: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 0,
    marginBottom: 0,
  },
  signatureBoxCaption: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
    fontWeight: "400",
  },
  typedSignatureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  typedSignatureInput: {
    flex: 1,
    fontSize: 24,
    fontFamily: "Inter-Regular",
    color: "#222",
    borderBottomWidth: 0,
    marginLeft: 8,
    paddingVertical: 0,
    backgroundColor: "transparent",
  },
  signaturePreviewContainer: {
    minHeight: 48,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginTop: 0,
    marginBottom: 0,
    width: "100%",
  },
  signaturePreview: {
    fontSize: 36,
    fontFamily: "GreatVibes-Regular",
    color: "#222",
    marginBottom: 0,
    marginLeft: 0,
  },
  signatureLine: {
    height: 1,
    backgroundColor: "#b5e0a6",
    width: "100%",
    marginTop: 2,
  },
  signatureButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  signatureButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
  },
  saveButton: {
    backgroundColor: "#082640",
  },
  signatureButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  saveButtonText: {
    color: "white",
  },
});

export default PostTripFormSignature;
