"use client";

import BackgroundEffects from "@/components/BackgroundEffects";
import BottomTabBar from "@/components/BottomTabBar";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import RadioButton from "@/components/CustomRadioButton";
import Header from "@/components/Header";
import { updatePreTripForm } from "@/redux/actions/driverActions";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const PreTripFormTrailerDetails = () => {
  const dispatch = useDispatch();
  const { preTripFormData } = useSelector((state: any) => state.driver);

  // Helper function to get trailer details inspection data from the new structure
  const getTrailerDetailsInspection = () => {
    const inspection = preTripFormData?.inspection || [];
    return inspection.find((item: any) => item.type === "trailerDetails");
  };

  const trailerDetailsInspection = getTrailerDetailsInspection();

  const [formData, setFormData] = useState({
    brakeConnections: trailerDetailsInspection?.items?.find((item: any) => item.name === "brakeConnections")?.status || "normal",
    brakes: trailerDetailsInspection?.items?.find((item: any) => item.name === "brakes")?.status || "normal",
    couplingDevices: trailerDetailsInspection?.items?.find((item: any) => item.name === "couplingDevices")?.status || "normal",
    couplingKingPin: trailerDetailsInspection?.items?.find((item: any) => item.name === "couplingKingPin")?.status || "normal",
    doors: trailerDetailsInspection?.items?.find((item: any) => item.name === "doors")?.status || "normal",
    hitch: trailerDetailsInspection?.items?.find((item: any) => item.name === "hitch")?.status || "normal",
    landingGear: trailerDetailsInspection?.items?.find((item: any) => item.name === "landingGear")?.status || "normal",
    lightsUp: trailerDetailsInspection?.items?.find((item: any) => item.name === "lightsUp")?.status || "normal",
    reflectors: trailerDetailsInspection?.items?.find((item: any) => item.name === "reflectors")?.status || "normal",
    reflectiveTape: trailerDetailsInspection?.items?.find((item: any) => item.name === "reflectiveTape")?.status || "normal",
    roof: trailerDetailsInspection?.items?.find((item: any) => item.name === "roof")?.status || "normal",
    suspensionSystem: trailerDetailsInspection?.items?.find((item: any) => item.name === "suspensionSystem")?.status || "normal",
    straps: trailerDetailsInspection?.items?.find((item: any) => item.name === "straps")?.status || "normal",
    tarpaulin: trailerDetailsInspection?.items?.find((item: any) => item.name === "tarpaulin")?.status || "normal",
    tires: trailerDetailsInspection?.items?.find((item: any) => item.name === "tires")?.status || "normal",
    wheelsRims1: trailerDetailsInspection?.items?.find((item: any) => item.name === "wheelsRims1")?.status || "normal",
    wheelsRims2: trailerDetailsInspection?.items?.find((item: any) => item.name === "wheelsRims2")?.status || "normal",
    brakeConnectionsDefectDetails: trailerDetailsInspection?.items?.find((item: any) => item.name === "brakeConnections")?.details || "",
    brakesDefectDetails: trailerDetailsInspection?.items?.find((item: any) => item.name === "brakes")?.details || "",
    couplingDevicesDefectDetails: trailerDetailsInspection?.items?.find((item: any) => item.name === "couplingDevices")?.details || "",
    couplingKingPinDefectDetails: trailerDetailsInspection?.items?.find((item: any) => item.name === "couplingKingPin")?.details || "",
    doorsDefectDetails: trailerDetailsInspection?.items?.find((item: any) => item.name === "doors")?.details || "",
    hitchDefectDetails: trailerDetailsInspection?.items?.find((item: any) => item.name === "hitch")?.details || "",
    landingGearDefectDetails: trailerDetailsInspection?.items?.find((item: any) => item.name === "landingGear")?.details || "",
    lightsUpDefectDetails: trailerDetailsInspection?.items?.find((item: any) => item.name === "lightsUp")?.details || "",
    reflectorsDefectDetails: trailerDetailsInspection?.items?.find((item: any) => item.name === "reflectors")?.details || "",
    reflectiveTapeDefectDetails: trailerDetailsInspection?.items?.find((item: any) => item.name === "reflectiveTape")?.details || "",
    roofDefectDetails: trailerDetailsInspection?.items?.find((item: any) => item.name === "roof")?.details || "",
    suspensionSystemDefectDetails: trailerDetailsInspection?.items?.find((item: any) => item.name === "suspensionSystem")?.details || "",
    strapsDefectDetails: trailerDetailsInspection?.items?.find((item: any) => item.name === "straps")?.details || "",
    tarpaulinDefectDetails: trailerDetailsInspection?.items?.find((item: any) => item.name === "tarpaulin")?.details || "",
    tiresDefectDetails: trailerDetailsInspection?.items?.find((item: any) => item.name === "tires")?.details || "",
    wheelsRims1DefectDetails: trailerDetailsInspection?.items?.find((item: any) => item.name === "wheelsRims1")?.details || "",
    wheelsRims2DefectDetails: trailerDetailsInspection?.items?.find((item: any) => item.name === "wheelsRims2")?.details || "",
  });
  const handleNext = () => {
    // Transform the form data into the new inspection structure
    const trailerDetailsInspectionData = {
      type: "trailerDetails",
      allFunctioning: allComponents.every(component => formData[component.id] === "normal"),
      items: allComponents.map(component => ({
        name: component.id,
        status: formData[component.id],
        details: formData[`${component.id}DefectDetails`]
      }))
    };

    // Update the inspection array in preTripFormData
    const existingInspection = preTripFormData?.inspection || [];
    const updatedInspection = existingInspection.filter((item: any) => item.type !== "trailerDetails");
    updatedInspection.push(trailerDetailsInspectionData);

    console.log('preTripFormData', preTripFormData)

    dispatch(
      updatePreTripForm({
        ...preTripFormData,
        inspection: updatedInspection,
      })
    );
    router.push("/pre-trip-signature");
  };

  const handleRadioToggle = (field, value) => {
    // Map "repair" to "defective" for consistency
    const statusValue = value === "repair" ? "defective" : value;
    setFormData({
      ...formData,
      [field]: statusValue,
    });
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
              index <= 12
                ? styles.progressStepActive
                : styles.progressStepInactive,
            ]}
          />
        ))}
      </View>
    );
  };

  const trailerComponents1 = [
    { id: "brakeConnections", label: "Brake Connections*" },
    { id: "brakes", label: "Brakes*" },
    { id: "couplingDevices", label: "Coupling Devices*" },
    { id: "couplingKingPin", label: "Coupling (King) Pin*" },
    { id: "doors", label: "Doors*" },
    { id: "hitch", label: "Hitch*" },
    { id: "landingGear", label: "Landing Gear*" },
    { id: "lightsUp", label: "Lights up*" },
  ];

  const trailerComponents2 = [
    { id: "reflectors", label: "Reflectors*" },
    { id: "reflectiveTape", label: "Reflective Tape*" },
    { id: "roof", label: "Roof*" },
    { id: "suspensionSystem", label: "Suspension System*" },
    { id: "straps", label: "Straps*" },
    { id: "tarpaulin", label: "Tarpaulin*" },
    { id: "tires", label: "Tires*" },
    { id: "wheelsRims1", label: "Wheels & Rims*" },
    { id: "wheelsRims2", label: "Wheels & Rims*" },
  ];

  const allComponents = [...trailerComponents1, ...trailerComponents2];
  const isNextDisabled = allComponents.some(
    (component) =>
      formData[component.id] === "defective" &&
      !formData[`${component.id}DefectDetails`].trim()
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundEffects />
      <Header title="Trailer(s)" subtitle="List of Trailers with Details" />

      <ScrollView style={styles.content}>
        {renderProgressBar()}

        {trailerComponents1.map((component) => (
          <View key={component.id} style={styles.radioSection}>
            <Text style={styles.radioLabel}>
              {component.label.replace("*", "")}
              <Text style={{ color: "#B70101" }}>*</Text>
            </Text>
            <View style={styles.radioGroup}>
              <RadioButton
                selected={formData[component.id] === "normal"}
                onPress={() => handleRadioToggle(component.id, "normal")}
                label="Checked - Normal"
              />
              <RadioButton
                selected={formData[component.id] === "defective"}
                onPress={() => handleRadioToggle(component.id, "repair")}
                label="Requires Repair"
                style={{ marginLeft: 20 }}
              />
            </View>
            {formData[component.id] === "defective" && (
              <CustomInput
                label={`${component.label.replace("*", "")} Defect Details`}
                placeholder={`Enter ${component.label.replace(
                  "*",
                  ""
                )} Defect Details`}
                value={formData[`${component.id}DefectDetails`]}
                onChangeText={(text: string) =>
                  setFormData({
                    ...formData,
                    [`${component.id}DefectDetails`]: text,
                  })
                }
                icon={
                  <Ionicons
                    name="alert-circle-outline"
                    size={20}
                    color="#B70101"
                  />
                }
              />
            )}
          </View>
        ))}

        {trailerComponents2.map((component) => (
          <View key={component.id} style={styles.radioSection}>
            <Text style={styles.radioLabel}>
              {component.label.replace("*", "")}
              <Text style={{ color: "#B70101" }}>*</Text>
            </Text>
            <View style={styles.radioGroup}>
              <RadioButton
                selected={formData[component.id] === "normal"}
                onPress={() => handleRadioToggle(component.id, "normal")}
                label="Checked - Normal"
              />
              <RadioButton
                selected={formData[component.id] === "defective"}
                onPress={() => handleRadioToggle(component.id, "repair")}
                label="Requires Repair"
                style={{ marginLeft: 20 }}
              />
            </View>
            {formData[component.id] === "defective" && (
              <CustomInput
                label={`${component.label.replace("*", "")} Defect Details`}
                placeholder={`Enter ${component.label.replace(
                  "*",
                  ""
                )} Defect Details`}
                value={formData[`${component.id}DefectDetails`]}
                onChangeText={(text: string) =>
                  setFormData({
                    ...formData,
                    [`${component.id}DefectDetails`]: text,
                  })
                }
                icon={
                  <Ionicons
                    name="alert-circle-outline"
                    size={20}
                    color="#B70101"
                  />
                }
              />
            )}
          </View>
        ))}

        <CustomButton
          title="Next"
          onPress={handleNext}
          disabled={isNextDisabled}
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
  radioSection: {
    marginVertical: 10,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});

export default PreTripFormTrailerDetails;
