"use client";

import BackgroundEffects from "@/components/BackgroundEffects";
import BottomTabBar from "@/components/BottomTabBar";
import CustomButton from "@/components/CustomButton";
import CustomCheckBox from "@/components/CustomCheckbox";
import CustomInput from "@/components/CustomInput";
import Header from "@/components/Header";
import { updatePreTripForm } from "@/redux/actions/driverActions";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const PreTripFormCab = () => {
  const dispatch = useDispatch();
  const { preTripFormData } = useSelector((state: any) => state.driver);

  const [formData, setFormData] = useState({
    allFunctioning: preTripFormData?.cab?.allFunctioning ?? true,
    windshieldClean: preTripFormData?.cab?.windshieldClean || false,
    wipersFunctional: preTripFormData?.cab?.wipersFunctional || false,
    gauges: preTripFormData?.cab?.gauges || false,
    horn: preTripFormData?.cab?.horn || false,
    defrostHeater: preTripFormData?.cab?.defrostHeater || false,
    windshieldDetails: preTripFormData?.cab?.windshieldDetails || "",
    wipersDetails: preTripFormData?.cab?.wipersDetails || "",
    gaugesDetails: preTripFormData?.cab?.gaugesDetails || "",
    hornDetails: preTripFormData?.cab?.hornDetails || "",
    defrostHeaterDetails: preTripFormData?.cab?.defrostHeaterDetails || "",
  });

  const isAnyChecked =
    formData.allFunctioning ||
    formData.windshieldClean ||
    formData.wipersFunctional ||
    formData.gauges ||
    formData.horn ||
    formData.defrostHeater;

  const areDetailsValid =
    (!formData.windshieldClean || formData.windshieldDetails.trim() !== "") &&
    (!formData.wipersFunctional || formData.wipersDetails.trim() !== "") &&
    (!formData.gauges || formData.gaugesDetails.trim() !== "") &&
    (!formData.horn || formData.hornDetails.trim() !== "") &&
    (!formData.defrostHeater || formData.defrostHeaterDetails.trim() !== "");

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    dispatch(
      updatePreTripForm({
        ...preTripFormData,
        cab: formData,
      })
    );
    router.push("/pre-trip-lights");
  };

  const detailsFieldMap = {
    windshieldClean: "windshieldDetails",
    wipersFunctional: "wipersDetails",
    gauges: "gaugesDetails",
    horn: "hornDetails",
    defrostHeater: "defrostHeaterDetails",
  };

  const handleCheckboxToggle = (field: string) => {
    if (field === "allFunctioning") {
      const newValue = !formData.allFunctioning;
      setFormData({
        ...formData,
        allFunctioning: newValue,
        windshieldClean: newValue ? false : formData.windshieldClean,
        wipersFunctional: newValue ? false : formData.wipersFunctional,
        gauges: newValue ? false : formData.gauges,
        horn: newValue ? false : formData.horn,
        defrostHeater: newValue ? false : formData.defrostHeater,

        windshieldDetails: newValue ? "" : formData.windshieldDetails,
        wipersDetails: newValue ? "" : formData.wipersDetails,
        gaugesDetails: newValue ? "" : formData.gaugesDetails,
        hornDetails: newValue ? "" : formData.hornDetails,
        defrostHeaterDetails: newValue ? "" : formData.defrostHeaterDetails,
      });
    } else {
      const isUnchecking = formData[field];
      const detailsField = detailsFieldMap[field];
      setFormData({
        ...formData,
        [field]: !formData[field],
        allFunctioning: false,
        ...(isUnchecking && detailsField ? { [detailsField]: "" } : {}),
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
              index <= 7
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
        title="Inside the Cab"
        subtitle="Check to ensure that all are functioning."
      />

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Cab Interior includes: Windshield Clean, Wipers Functional, Gauges,
          Horn, Defrost/Heater
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
            checked={formData.windshieldClean}
            onPress={() => handleCheckboxToggle("windshieldClean")}
            label="Windshield Clean & Not Cracked"
          />

          <CustomCheckBox
            checked={formData.wipersFunctional}
            onPress={() => handleCheckboxToggle("wipersFunctional")}
            label="Wipers Functional"
          />

          <CustomCheckBox
            checked={formData.gauges}
            onPress={() => handleCheckboxToggle("gauges")}
            label="Gauges"
          />

          <CustomCheckBox
            checked={formData.horn}
            onPress={() => handleCheckboxToggle("horn")}
            label="Horn"
          />

          <CustomCheckBox
            checked={formData.defrostHeater}
            onPress={() => handleCheckboxToggle("defrostHeater")}
            label="Defrost / Heater"
          />
        </View>

        {formData.windshieldClean && (
          <CustomInput
            label="Windshield Clean & Not Cracked Details"
            placeholder="Enter Windshield Clean & Not Cracked Details"
            value={formData.windshieldDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, windshieldDetails: text })
            }
            icon={
              <Ionicons name="car-sport-outline" size={20} color="#082640" />
            }
          />
        )}
        {formData.wipersFunctional && (
          <CustomInput
            label="Wipers Functional Details"
            placeholder="Enter Wipers Functional Details"
            value={formData.wipersDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, wipersDetails: text })
            }
            icon={<Ionicons name="rainy-outline" size={20} color="#082640" />}
          />
        )}
        {formData.gauges && (
          <CustomInput
            label="Gauges Details"
            placeholder="Enter Gauges Details"
            value={formData.gaugesDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, gaugesDetails: text })
            }
            icon={
              <Ionicons name="speedometer-outline" size={20} color="#082640" />
            }
          />
        )}
        {formData.horn && (
          <CustomInput
            label="Horn Details"
            placeholder="Enter Horn Details"
            value={formData.hornDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, hornDetails: text })
            }
            icon={
              <Ionicons name="megaphone-outline" size={20} color="#082640" />
            }
          />
        )}
        {formData.defrostHeater && (
          <CustomInput
            label="Defrost / Heater Details"
            placeholder="Enter Defrost / Heater Details"
            value={formData.defrostHeaterDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, defrostHeaterDetails: text })
            }
            icon={<Ionicons name="snow-outline" size={20} color="#082640" />}
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

export default PreTripFormCab;
