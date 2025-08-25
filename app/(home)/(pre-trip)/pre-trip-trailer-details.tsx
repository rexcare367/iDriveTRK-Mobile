"use client";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BackgroundEffects from "../../../components/BackgroundEffects";
import BottomTabBar from "../../../components/BottomTabBar";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import RadioButton from "../../../components/CustomRadioButton";
import Header from "../../../components/Header";
import { updatePreTripForm } from "../../../redux/actions/driverActions";

const PreTripFormTrailerDetails = () => {
  const dispatch = useDispatch();
  const { preTripFormData } = useSelector((state: any) => state.driver);

  const [formData, setFormData] = useState({
    brakeConnections:
      preTripFormData?.trailerDetails?.brakeConnections || "normal",
    brakes: preTripFormData?.trailerDetails?.brakes || "normal",
    couplingDevices:
      preTripFormData?.trailerDetails?.couplingDevices || "normal",
    couplingKingPin:
      preTripFormData?.trailerDetails?.couplingKingPin || "normal",
    doors: preTripFormData?.trailerDetails?.doors || "normal",
    hitch: preTripFormData?.trailerDetails?.hitch || "normal",
    landingGear: preTripFormData?.trailerDetails?.landingGear || "normal",
    lightsUp: preTripFormData?.trailerDetails?.lightsUp || "normal",
    reflectors: preTripFormData?.trailerDetails?.reflectors || "normal",
    reflectiveTape: preTripFormData?.trailerDetails?.reflectiveTape || "normal",
    roof: preTripFormData?.trailerDetails?.roof || "normal",
    suspensionSystem:
      preTripFormData?.trailerDetails?.suspensionSystem || "normal",
    straps: preTripFormData?.trailerDetails?.straps || "normal",
    tarpaulin: preTripFormData?.trailerDetails?.tarpaulin || "normal",
    tires: preTripFormData?.trailerDetails?.tires || "normal",
    wheelsRims1: preTripFormData?.trailerDetails?.wheelsRims1 || "normal",
    wheelsRims2: preTripFormData?.trailerDetails?.wheelsRims2 || "normal",
    brakeConnectionsDefectDetails:
      preTripFormData?.trailerDetails?.brakeConnectionsDefectDetails || "",
    brakesDefectDetails:
      preTripFormData?.trailerDetails?.brakesDefectDetails || "",
    couplingDevicesDefectDetails:
      preTripFormData?.trailerDetails?.couplingDevicesDefectDetails || "",
    couplingKingPinDefectDetails:
      preTripFormData?.trailerDetails?.couplingKingPinDefectDetails || "",
    doorsDefectDetails:
      preTripFormData?.trailerDetails?.doorsDefectDetails || "",
    hitchDefectDetails:
      preTripFormData?.trailerDetails?.hitchDefectDetails || "",
    landingGearDefectDetails:
      preTripFormData?.trailerDetails?.landingGearDefectDetails || "",
    lightsUpDefectDetails:
      preTripFormData?.trailerDetails?.lightsUpDefectDetails || "",
    reflectorsDefectDetails:
      preTripFormData?.trailerDetails?.reflectorsDefectDetails || "",
    reflectiveTapeDefectDetails:
      preTripFormData?.trailerDetails?.reflectiveTapeDefectDetails || "",
    roofDefectDetails: preTripFormData?.trailerDetails?.roofDefectDetails || "",
    suspensionSystemDefectDetails:
      preTripFormData?.trailerDetails?.suspensionSystemDefectDetails || "",
    strapsDefectDetails:
      preTripFormData?.trailerDetails?.strapsDefectDetails || "",
    tarpaulinDefectDetails:
      preTripFormData?.trailerDetails?.tarpaulinDefectDetails || "",
    tiresDefectDetails:
      preTripFormData?.trailerDetails?.tiresDefectDetails || "",
    wheelsRims1DefectDetails:
      preTripFormData?.trailerDetails?.wheelsRims1DefectDetails || "",
    wheelsRims2DefectDetails:
      preTripFormData?.trailerDetails?.wheelsRims2DefectDetails || "",
  });

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    dispatch(
      updatePreTripForm({
        ...preTripFormData,
        trailerDetails: formData,
      })
    );
    router.push("/pre-trip-signature");
  };

  const handleRadioToggle = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
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
      formData[component.id] === "repair" &&
      !formData[`${component.id}DefectDetails`].trim()
  );

  return (
    <View style={styles.container}>
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
                selected={formData[component.id] === "repair"}
                onPress={() => handleRadioToggle(component.id, "repair")}
                label="Requires Repair"
                style={{ marginLeft: 20 }}
              />
            </View>
            {formData[component.id] === "repair" && (
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
                selected={formData[component.id] === "repair"}
                onPress={() => handleRadioToggle(component.id, "repair")}
                label="Requires Repair"
                style={{ marginLeft: 20 }}
              />
            </View>
            {formData[component.id] === "repair" && (
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
