"use client";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BackgroundEffects from "../../../components/BackgroundEffects";
import BottomTabBar from "../../../components/BottomTabBar";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import RadioButton from "../../../components/CustomRadioButton";
import { updatePostTripForm } from "../../../redux/actions/driverActions";

const PostTripFormTrailerDetails = () => {
  const dispatch = useDispatch();
  const { postTripFormData } = useSelector((state: any) => state.driver);

  const [formData, setFormData] = useState({
    brakeConnections:
      postTripFormData?.trailerDetails?.brakeConnections || "normal",
    brakes: postTripFormData?.trailerDetails?.brakes || "normal",
    couplingDevices:
      postTripFormData?.trailerDetails?.couplingDevices || "normal",
    couplingKingPin:
      postTripFormData?.trailerDetails?.couplingKingPin || "normal",
    doors: postTripFormData?.trailerDetails?.doors || "normal",
    hitch: postTripFormData?.trailerDetails?.hitch || "normal",
    landingGear: postTripFormData?.trailerDetails?.landingGear || "normal",
    lightsUp: postTripFormData?.trailerDetails?.lightsUp || "normal",
    reflectors: postTripFormData?.trailerDetails?.reflectors || "normal",
    reflectiveTape:
      postTripFormData?.trailerDetails?.reflectiveTape || "normal",
    roof: postTripFormData?.trailerDetails?.roof || "normal",
    suspensionSystem:
      postTripFormData?.trailerDetails?.suspensionSystem || "normal",
    straps: postTripFormData?.trailerDetails?.straps || "normal",
    tarpaulin: postTripFormData?.trailerDetails?.tarpaulin || "normal",
    tires: postTripFormData?.trailerDetails?.tires || "normal",
    wheelsRims1: postTripFormData?.trailerDetails?.wheelsRims1 || "normal",
    wheelsRims2: postTripFormData?.trailerDetails?.wheelsRims2 || "normal",
    brakeConnectionsDefectDetails:
      postTripFormData?.trailerDetails?.brakeConnectionsDefectDetails || "",
    brakesDefectDetails:
      postTripFormData?.trailerDetails?.brakesDefectDetails || "",
    couplingDevicesDefectDetails:
      postTripFormData?.trailerDetails?.couplingDevicesDefectDetails || "",
    couplingKingPinDefectDetails:
      postTripFormData?.trailerDetails?.couplingKingPinDefectDetails || "",
    doorsDefectDetails:
      postTripFormData?.trailerDetails?.doorsDefectDetails || "",
    hitchDefectDetails:
      postTripFormData?.trailerDetails?.hitchDefectDetails || "",
    landingGearDefectDetails:
      postTripFormData?.trailerDetails?.landingGearDefectDetails || "",
    lightsUpDefectDetails:
      postTripFormData?.trailerDetails?.lightsUpDefectDetails || "",
    reflectorsDefectDetails:
      postTripFormData?.trailerDetails?.reflectorsDefectDetails || "",
    reflectiveTapeDefectDetails:
      postTripFormData?.trailerDetails?.reflectiveTapeDefectDetails || "",
    roofDefectDetails:
      postTripFormData?.trailerDetails?.roofDefectDetails || "",
    suspensionSystemDefectDetails:
      postTripFormData?.trailerDetails?.suspensionSystemDefectDetails || "",
    strapsDefectDetails:
      postTripFormData?.trailerDetails?.strapsDefectDetails || "",
    tarpaulinDefectDetails:
      postTripFormData?.trailerDetails?.tarpaulinDefectDetails || "",
    tiresDefectDetails:
      postTripFormData?.trailerDetails?.tiresDefectDetails || "",
    wheelsRims1DefectDetails:
      postTripFormData?.trailerDetails?.wheelsRims1DefectDetails || "",
    wheelsRims2DefectDetails:
      postTripFormData?.trailerDetails?.wheelsRims2DefectDetails || "",
  });

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    dispatch(
      updatePostTripForm({
        ...postTripFormData,
        trailerDetails: formData,
      })
    );
    router.push("/post-trip-signature");
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
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Trailer(s)</Text>
        <Text style={styles.subtitle}>List of Trailers with Details</Text>

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
                onChangeText={(text) =>
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
                onChangeText={(text) =>
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

export default PostTripFormTrailerDetails;
