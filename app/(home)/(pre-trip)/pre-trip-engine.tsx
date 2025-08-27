import BackgroundEffects from "@/components/BackgroundEffects";
import BottomTabBar from "@/components/BottomTabBar";
import CustomButton from "@/components/CustomButton";
import Checkbox from "@/components/CustomCheckbox";
import CustomInput from "@/components/CustomInput";
import Header from "@/components/Header";
import { updatePreTripForm } from "@/redux/actions/driverActions";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const PreTripFormEngine = () => {
  const dispatch = useDispatch();
  const { preTripFormData } = useSelector((state: any) => state.driver);

  const [formData, setFormData] = useState({
    allFunctioning: preTripFormData?.engine?.allFunctioning || true,
    engine: preTripFormData?.engine?.engine || false,
    alternator: preTripFormData?.engine?.alternator || false,
    transmission: preTripFormData?.engine?.transmission || false,
    battery: preTripFormData?.engine?.battery || false,
    beltAndHoses: preTripFormData?.engine?.beltAndHoses || false,
    engineDetails: preTripFormData?.engine?.engineDetails || "",
    alternatorDetails: preTripFormData?.engine?.alternatorDetails || "",
    transmissionDetails: preTripFormData?.engine?.transmissionDetails || "",
    batteryDetails: preTripFormData?.engine?.batteryDetails || "",
    beltAndHosesDetails: preTripFormData?.engine?.beltAndHosesDetails || "",
  });

  const isAnyChecked =
    formData.allFunctioning ||
    formData.engine ||
    formData.alternator ||
    formData.transmission ||
    formData.battery ||
    formData.beltAndHoses;

  const areDetailsValid =
    (!formData.engine || formData.engineDetails.trim() !== "") &&
    (!formData.alternator || formData.alternatorDetails.trim() !== "") &&
    (!formData.transmission || formData.transmissionDetails.trim() !== "") &&
    (!formData.battery || formData.batteryDetails.trim() !== "") &&
    (!formData.beltAndHoses || formData.beltAndHosesDetails.trim() !== "");

  const handleNext = () => {
    dispatch(
      updatePreTripForm({
        ...preTripFormData,
        engine: formData,
      })
    );
    router.push("/pre-trip-fluids");
  };

  const handleCheckboxToggle = (field: string) => {
    if (field === "allFunctioning") {
      const newValue = !formData.allFunctioning;
      setFormData({
        ...formData,
        allFunctioning: newValue,
        engine: newValue ? false : formData.engine,
        alternator: newValue ? false : formData.alternator,
        transmission: newValue ? false : formData.transmission,
        battery: newValue ? false : formData.battery,
        beltAndHoses: newValue ? false : formData.beltAndHoses,

        engineDetails: newValue ? "" : formData.engineDetails,
        alternatorDetails: newValue ? "" : formData.alternatorDetails,
        transmissionDetails: newValue ? "" : formData.transmissionDetails,
        batteryDetails: newValue ? "" : formData.batteryDetails,
        beltAndHosesDetails: newValue ? "" : formData.beltAndHosesDetails,
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
              index <= 3
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
        title="Engine Compartment"
        subtitle="Check to ensure that all are functioning."
      />

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Engine Compartment includes: Engine, Alternator, Transmission, Battery
          and Belts
        </Text>

        {renderProgressBar()}

        <Text style={styles.sectionTitle}>
          Check any components that need repairs or attention
        </Text>
        <View style={styles.sectionDivider} />
        <View style={styles.checkboxContainer}>
          <Checkbox
            checked={formData.allFunctioning}
            onPress={() => handleCheckboxToggle("allFunctioning")}
            label="All Functioning"
          />
          <Checkbox
            checked={formData.engine}
            onPress={() => handleCheckboxToggle("engine")}
            label="Engine"
          />

          <Checkbox
            checked={formData.alternator}
            onPress={() => handleCheckboxToggle("alternator")}
            label="Alternator"
          />

          <Checkbox
            checked={formData.transmission}
            onPress={() => handleCheckboxToggle("transmission")}
            label="Transmission"
          />

          <Checkbox
            checked={formData.battery}
            onPress={() => handleCheckboxToggle("battery")}
            label="Battery"
          />
          <Checkbox
            checked={formData.beltAndHoses}
            onPress={() => handleCheckboxToggle("beltAndHoses")}
            label="Belt and Hoses"
          />
        </View>
        {formData.engine && (
          <CustomInput
            label="Engine Details"
            placeholder="Enter Engine Details"
            value={formData.engineDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, engineDetails: text })
            }
            icon={
              <Ionicons name="speedometer-outline" size={20} color="#082640" />
            }
          />
        )}
        {formData.alternator && (
          <CustomInput
            label="Alternator Details"
            placeholder="Enter Alternator Details"
            value={formData.alternatorDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, alternatorDetails: text })
            }
            icon={<Ionicons name="flash-outline" size={20} color="#082640" />}
          />
        )}
        {formData.transmission && (
          <CustomInput
            label="Transmission Details"
            placeholder="Enter Transmission Details"
            value={formData.transmissionDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, transmissionDetails: text })
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
        {formData.battery && (
          <CustomInput
            label="Battery Details"
            placeholder="Enter Battery Details"
            value={formData.batteryDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, batteryDetails: text })
            }
            icon={
              <Ionicons name="battery-half-outline" size={20} color="#082640" />
            }
          />
        )}
        {formData.beltAndHoses && (
          <CustomInput
            label="Belt and Hoses Details"
            placeholder="Enter Belt and Hoses Details"
            value={formData.beltAndHosesDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, beltAndHosesDetails: text })
            }
            icon={
              <Ionicons name="git-compare-outline" size={20} color="#082640" />
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
});

export default PreTripFormEngine;
