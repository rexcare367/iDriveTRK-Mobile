import BackgroundEffects from "@/components/BackgroundEffects";
import BottomTabBar from "@/components/BottomTabBar";
import CustomButton from "@/components/CustomButton";
import CustomCheckBox from "@/components/CustomCheckbox";
import CustomInput from "@/components/CustomInput";
import Header from "@/components/Header";
import { updatePostTripForm } from "@/redux/actions/driverActions";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const PostTripFormLights = () => {
  const dispatch = useDispatch();
  const { postTripFormData } = useSelector((state: any) => state.driver);

  const [formData, setFormData] = useState({
    allFunctioning: postTripFormData?.lights?.allFunctioning ?? true,
    headStop: postTripFormData?.lights?.headStop || false,
    tailDash: postTripFormData?.lights?.tailDash || false,
    turnIndicators: postTripFormData?.lights?.turnIndicators || false,
    headStopDetails: postTripFormData?.lights?.headStopDetails || "",
    tailDashDetails: postTripFormData?.lights?.tailDashDetails || "",
    turnIndicatorsDetails:
      postTripFormData?.lights?.turnIndicatorsDetails || "",
  });

  const [showDetails, setShowDetails] = useState({
    headStop: !!formData.headStop,
    tailDash: !!formData.tailDash,
    turnIndicators: !!formData.turnIndicators,
  });

  const isAnyChecked =
    formData.allFunctioning ||
    formData.headStop ||
    formData.tailDash ||
    formData.turnIndicators;

  const areDetailsValid =
    (!formData.headStop || formData.headStopDetails.trim() !== "") &&
    (!formData.tailDash || formData.tailDashDetails.trim() !== "") &&
    (!formData.turnIndicators || formData.turnIndicatorsDetails.trim() !== "");

  const handleNext = () => {
    dispatch(
      updatePostTripForm({
        ...postTripFormData,
        lights: formData,
      })
    );
    router.push("/post-trip-checklist");
  };

  const handleCheckboxToggle = (field: string) => {
    if (field === "allFunctioning") {
      const newValue = !formData.allFunctioning;
      setFormData({
        ...formData,
        allFunctioning: newValue,
        headStop: newValue ? false : formData.headStop,
        tailDash: newValue ? false : formData.tailDash,
        turnIndicators: newValue ? false : formData.turnIndicators,
        headStopDetails: newValue ? "" : formData.headStopDetails,
        tailDashDetails: newValue ? "" : formData.tailDashDetails,
        turnIndicatorsDetails: newValue ? "" : formData.turnIndicatorsDetails,
      });
      setShowDetails({
        headStop: false,
        tailDash: false,
        turnIndicators: false,
      });
    } else {
      const isUnchecking = formData[field];
      setFormData({
        ...formData,
        [field]: !formData[field],
        allFunctioning: false,
        ...(isUnchecking && {
          [`${field}Details`]: "",
        }),
      });
      setShowDetails((prev) => ({
        ...prev,
        [field]: !formData[field],
      }));
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
              index <= 8
                ? styles.progressStepActive
                : styles.progressStepInactive,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BackgroundEffects />
      <Header
        title="Lights"
        subtitle="Check to ensure that all are functioning."
      />

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Lights includes: Head - Stop, Tail - Dash, Turn Indicators
        </Text>

        {renderProgressBar()}

        <Text style={styles.sectionTitle}>
          Check any components that need repairs or attention
        </Text>
        <View style={styles.sectionDivider} />

        <View style={styles.checkboxContainer}>
          <CustomCheckBox
            checked={formData.allFunctioning}
            onPress={() => handleCheckboxToggle("allFunctioning")}
            label="All Functioning"
          />

          <CustomCheckBox
            checked={formData.headStop}
            onPress={() => handleCheckboxToggle("headStop")}
            label="Head - Stop"
          />

          <CustomCheckBox
            checked={formData.tailDash}
            onPress={() => handleCheckboxToggle("tailDash")}
            label="Tail - Dash"
          />

          <CustomCheckBox
            checked={formData.turnIndicators}
            onPress={() => handleCheckboxToggle("turnIndicators")}
            label="Turn Indicators"
          />
        </View>

        {formData.headStop && showDetails.headStop && (
          <CustomInput
            label="Head Stop Details"
            placeholder="Enter Head Stop Details"
            value={formData.headStopDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, headStopDetails: text })
            }
            icon={<Ionicons name="bulb-outline" size={20} color="#082640" />}
          />
        )}
        {formData.tailDash && showDetails.tailDash && (
          <CustomInput
            label="Tail Dash Details"
            placeholder="Enter Tail Dash Details"
            value={formData.tailDashDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, tailDashDetails: text })
            }
            icon={<Ionicons name="car-outline" size={20} color="#082640" />}
          />
        )}
        {formData.turnIndicators && showDetails.turnIndicators && (
          <CustomInput
            label="Turn Indicator Details"
            placeholder="Enter Turn Indicator Details"
            value={formData.turnIndicatorsDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, turnIndicatorsDetails: text })
            }
            icon={
              <Ionicons
                name="swap-horizontal-outline"
                size={20}
                color="#082640"
              />
            }
          />
        )}

        <CustomButton
          title="Next"
          onPress={handleNext}
          disabled={!isAnyChecked || !areDetailsValid}
        />
      </ScrollView>

      <BottomTabBar activeTab="Home" />
    </View>
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
    marginBottom: 5,
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 14,
    marginBottom: 15,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: "#E2DFDFFF",
    marginVertical: 10,
    marginBottom: 20,
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 10,
  },
});

export default PostTripFormLights;
