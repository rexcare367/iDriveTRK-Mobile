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
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const PostTripFormRearVehicle = () => {
  const dispatch = useDispatch();
  const { postTripFormData } = useSelector((state: any) => state.driver);

  // Helper function to get rear vehicle inspection data from the new structure
  const getRearVehicleInspection = () => {
    const inspection = postTripFormData?.inspection || [];
    return inspection.find((item: any) => item.type === "rearVehicle");
  };

  const rearVehicleInspection = getRearVehicleInspection();

  const [formData, setFormData] = useState({
    allFunctioning: rearVehicleInspection?.allFunctioning ?? true,
    exhaust: rearVehicleInspection?.items?.find((item: any) => item.name === "exhaust")?.status === "defective" || false,
    muffler: rearVehicleInspection?.items?.find((item: any) => item.name === "muffler")?.status === "defective" || false,
    rearDoorLatch: rearVehicleInspection?.items?.find((item: any) => item.name === "rearDoorLatch")?.status === "defective" || false,
    padlock: rearVehicleInspection?.items?.find((item: any) => item.name === "padlock")?.status === "defective" || false,
    exhaustDetails: rearVehicleInspection?.items?.find((item: any) => item.name === "exhaust")?.details || "",
    mufflerDetails: rearVehicleInspection?.items?.find((item: any) => item.name === "muffler")?.details || "",
    rearDoorDetails: rearVehicleInspection?.items?.find((item: any) => item.name === "rearDoorLatch")?.details || "",
    padlockDetails: rearVehicleInspection?.items?.find((item: any) => item.name === "padlock")?.details || "",
  });

  const isAnyChecked =
    formData.allFunctioning ||
    formData.exhaust ||
    formData.muffler ||
    formData.rearDoorLatch ||
    formData.padlock;

  const areDetailsValid =
    (!formData.exhaust || formData.exhaustDetails.trim() !== "") &&
    (!formData.muffler || formData.mufflerDetails.trim() !== "") &&
    (!formData.rearDoorLatch || formData.rearDoorDetails.trim() !== "") &&
    (!formData.padlock || formData.padlockDetails.trim() !== "");

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    // Transform the form data into the new inspection structure
    const rearVehicleInspectionData = {
      type: "rearVehicle",
      allFunctioning: formData.allFunctioning,
      items: [
        {
          name: "exhaust",
          status: formData.exhaust ? "defective" : "normal",
          details: formData.exhaustDetails
        },
        {
          name: "muffler",
          status: formData.muffler ? "defective" : "normal",
          details: formData.mufflerDetails
        },
        {
          name: "rearDoorLatch",
          status: formData.rearDoorLatch ? "defective" : "normal",
          details: formData.rearDoorDetails
        },
        {
          name: "padlock",
          status: formData.padlock ? "defective" : "normal",
          details: formData.padlockDetails
        }
      ]
    };

    // Update the inspection array in postTripFormData
    const existingInspection = postTripFormData?.inspection || [];
    const updatedInspection = existingInspection.filter((item: any) => item.type !== "rearVehicle");
    updatedInspection.push(rearVehicleInspectionData);

    dispatch(
      updatePostTripForm({
        ...postTripFormData,
        inspection: updatedInspection,
      })
    );
    router.push("/post-trip-cab");
  };

  const handleCheckboxToggle = (field: string) => {
    if (field === "allFunctioning") {
      const newValue = !formData.allFunctioning;
      setFormData({
        ...formData,
        allFunctioning: newValue,
        exhaust: newValue ? false : formData.exhaust,
        muffler: newValue ? false : formData.muffler,
        rearDoorLatch: newValue ? false : formData.rearDoorLatch,
        padlock: newValue ? false : formData.padlock,
        exhaustDetails: newValue ? "" : formData.exhaustDetails,
        mufflerDetails: newValue ? "" : formData.mufflerDetails,
        rearDoorDetails: newValue ? "" : formData.rearDoorDetails,
        padlockDetails: newValue ? "" : formData.padlockDetails,
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
              index <= 6
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
        title="Rear of Vehicle"
        subtitle="Check to ensure that all are functioning."
      />

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Rare of Vehicles includes: Exhaust, Muffler, Rear Door Latch, Padlock
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
            checked={formData.exhaust}
            onPress={() => handleCheckboxToggle("exhaust")}
            label="Exhaust"
          />

          <CustomCheckBox
            checked={formData.muffler}
            onPress={() => handleCheckboxToggle("muffler")}
            label="Muffler"
          />

          <CustomCheckBox
            checked={formData.rearDoorLatch}
            onPress={() => handleCheckboxToggle("rearDoorLatch")}
            label="Rear Door Latch"
          />

          <CustomCheckBox
            checked={formData.padlock}
            onPress={() => handleCheckboxToggle("padlock")}
            label="Padlock"
          />
        </View>

        {!formData.allFunctioning && formData.exhaust && (
          <CustomInput
            label="Exhaust Details"
            placeholder="Enter Exhaust Details"
            value={formData.exhaustDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, exhaustDetails: text })
            }
            icon={<Ionicons name="cloud-outline" size={20} color="#082640" />}
          />
        )}
        {!formData.allFunctioning && formData.muffler && (
          <CustomInput
            label="Muffler Details"
            placeholder="Enter Muffler Details"
            value={formData.mufflerDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, mufflerDetails: text })
            }
            icon={
              <Ionicons
                name="musical-notes-outline"
                size={20}
                color="#082640"
              />
            }
          />
        )}
        {!formData.allFunctioning && formData.rearDoorLatch && (
          <CustomInput
            label="Rear Door Details"
            placeholder="Enter Rear Door Details"
            value={formData.rearDoorDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, rearDoorDetails: text })
            }
            icon={
              <Ionicons name="lock-closed-outline" size={20} color="#082640" />
            }
          />
        )}
        {!formData.allFunctioning && formData.padlock && (
          <CustomInput
            label="Padlock Details"
            placeholder="Enter Padlock Details"
            value={formData.padlockDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, padlockDetails: text })
            }
            icon={<Ionicons name="key-outline" size={20} color="#082640" />}
          />
        )}

        <CustomButton
          title="Next"
          onPress={handleNext}
          disabled={
            !isAnyChecked || (!formData.allFunctioning && !areDetailsValid)
          }
        />
      </ScrollView>

      <BottomTabBar activeTab="Home" />
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

export default PostTripFormRearVehicle;
