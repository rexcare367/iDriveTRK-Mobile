"use client";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BackgroundEffects from "../../../components/BackgroundEffects";
import BottomTabBar from "../../../components/BottomTabBar";
import CustomButton from "../../../components/CustomButton";
import CustomCheckbox from "../../../components/CustomCheckbox";
import CustomInput from "../../../components/CustomInput";
import Header from "../../../components/Header";
import { updatePreTripForm } from "../../../redux/actions/driverActions";

const PreTripFormWheels = () => {
  const dispatch = useDispatch();
  const { preTripFormData } = useSelector((state: any) => state.driver);

  const [formData, setFormData] = useState({
    allFunctioning: preTripFormData?.wheels?.allFunctioning || true,
    wheels: preTripFormData?.wheels?.wheels || false,
    rims: preTripFormData?.wheels?.rims || false,
    lugs: preTripFormData?.wheels?.lugs || false,
    tires: preTripFormData?.wheels?.tires || false,
    tireChains: preTripFormData?.wheels?.tireChains || false,
    wheelsDetails: preTripFormData?.wheels?.wheelsDetails || "",
    rimsDetails: preTripFormData?.wheels?.rimsDetails || "",
    lugsDetails: preTripFormData?.wheels?.lugsDetails || "",
    tiresDetails: preTripFormData?.wheels?.tiresDetails || "",
    tireChainsDetails: preTripFormData?.wheels?.tireChainsDetails || "",
  });

  const isAnyChecked =
    formData.allFunctioning ||
    formData.wheels ||
    formData.rims ||
    formData.lugs ||
    formData.tires ||
    formData.tireChains;

  const areDetailsValid =
    (!formData.wheels || formData.wheelsDetails.trim() !== "") &&
    (!formData.rims || formData.rimsDetails.trim() !== "") &&
    (!formData.lugs || formData.lugsDetails.trim() !== "") &&
    (!formData.tires || formData.tiresDetails.trim() !== "") &&
    (!formData.tireChains || formData.tireChainsDetails.trim() !== "");

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    dispatch(
      updatePreTripForm({
        ...preTripFormData,
        wheels: formData,
      })
    );
    router.push("/pre-trip-rear-vehicle");
  };

  const handleCheckboxToggle = (field: any) => {
    if (field === "allFunctioning") {
      const newValue = !formData.allFunctioning;
      setFormData({
        ...formData,
        allFunctioning: newValue,
        wheels: newValue ? false : formData.wheels,
        rims: newValue ? false : formData.rims,
        lugs: newValue ? false : formData.lugs,
        tires: newValue ? false : formData.tires,
        tireChains: newValue ? false : formData.tireChains,

        wheelsDetails: newValue ? "" : formData.wheelsDetails,
        rimsDetails: newValue ? "" : formData.rimsDetails,
        lugsDetails: newValue ? "" : formData.lugsDetails,
        tiresDetails: newValue ? "" : formData.tiresDetails,
        tireChainsDetails: newValue ? "" : formData.tireChainsDetails,
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
              index <= 5
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
        title="Wheels & Tires"
        subtitle="Check to ensure that all are functioning."
      />

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Wheels and Tires includes: Wheels, Rims, Lugs, Tires, Lugs, Tire
          Chains
        </Text>

        {renderProgressBar()}

        <Text style={styles.sectionTitle}>
          Check any components that need repairs or attention
        </Text>
        <View style={styles.sectionDivider} />

        <View style={styles.checkboxContainer}>
          <CustomCheckbox
            checked={formData.allFunctioning}
            onPress={() => handleCheckboxToggle("allFunctioning")}
            label="All Functioning"
          />

          <CustomCheckbox
            checked={formData.wheels}
            onPress={() => handleCheckboxToggle("wheels")}
            label="Wheels"
          />

          <CustomCheckbox
            checked={formData.rims}
            onPress={() => handleCheckboxToggle("rims")}
            label="Rims"
          />

          <CustomCheckbox
            checked={formData.lugs}
            onPress={() => handleCheckboxToggle("lugs")}
            label="Lugs"
          />

          <CustomCheckbox
            checked={formData.tires}
            onPress={() => handleCheckboxToggle("tires")}
            label="Tires"
          />

          <CustomCheckbox
            checked={formData.tireChains}
            onPress={() => handleCheckboxToggle("tireChains")}
            label="Tire Chains"
          />
        </View>

        {formData.wheels && (
          <CustomInput
            label="Wheels Details"
            placeholder="Enter Wheels Details"
            value={formData.wheelsDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, wheelsDetails: text })
            }
            icon={
              <Ionicons name="car-sport-outline" size={20} color="#082640" />
            }
          />
        )}
        {formData.rims && (
          <CustomInput
            label="Rims Details"
            placeholder="Enter Rim Details"
            value={formData.rimsDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, rimsDetails: text })
            }
            icon={<Ionicons name="disc-outline" size={20} color="#082640" />}
          />
        )}
        {formData.lugs && (
          <CustomInput
            label="Lugs Details"
            placeholder="Enter Lugs Details"
            value={formData.lugsDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, lugsDetails: text })
            }
            icon={<Ionicons name="ellipse-outline" size={20} color="#082640" />}
          />
        )}
        {formData.tires && (
          <CustomInput
            label="Tires Details"
            placeholder="Enter Tires Details"
            value={formData.tiresDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, tiresDetails: text })
            }
            icon={
              <Ionicons
                name="radio-button-on-outline"
                size={20}
                color="#082640"
              />
            }
          />
        )}
        {formData.tireChains && (
          <CustomInput
            label="Tire Chains Details"
            placeholder="Enter Tire Chains Details"
            value={formData.tireChainsDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, tireChainsDetails: text })
            }
            icon={<Ionicons name="link-outline" size={20} color="#082640" />}
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
  checkboxContainer: {
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#666",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#082640",
    borderColor: "#082640",
  },
  checkboxLabel: {
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 10,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: "#E2DFDFFF",
    marginVertical: 10,
    marginBottom: 20,
  },
});

export default PreTripFormWheels;
