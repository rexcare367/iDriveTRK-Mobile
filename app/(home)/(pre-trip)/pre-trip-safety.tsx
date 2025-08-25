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
import CustomCheckbox from "../../../components/CustomCheckbox";
import CustomInput from "../../../components/CustomInput";
import CustomRadioButton from "../../../components/CustomRadioButton";
import { updatePreTripForm } from "../../../redux/actions/driverActions";

const PreTripFormSafety = () => {
  const dispatch = useDispatch();
  const { preTripFormData } = useSelector((state: any) => state.driver);

  const [formData, setFormData] = useState({
    allFunctioning: preTripFormData?.safety?.allFunctioning ?? true,
    fireExtinguisher: preTripFormData?.safety?.fireExtinguisher || false,
    flagsFlares: preTripFormData?.safety?.flagsFlares || false,
    reflectiveTriangles: preTripFormData?.safety?.reflectiveTriangles || false,
    fireExtinguisherDetails:
      preTripFormData?.safety?.fireExtinguisherDetails || "",
    flagsFlaresDetails: preTripFormData?.safety?.flagsFlaresDetails || "",
    reflectiveTrianglesDetails:
      preTripFormData?.safety?.reflectiveTrianglesDetails || "",
    others: preTripFormData?.safety?.others || "noOtherNotes",
    othersDefectDetails: preTripFormData?.safety?.othersDefectDetails || "",
  });

  const isAnyChecked =
    formData.allFunctioning ||
    formData.fireExtinguisher ||
    formData.flagsFlares ||
    formData.reflectiveTriangles;

  const areDetailsValid =
    (!formData.fireExtinguisher ||
      formData.fireExtinguisherDetails.trim() !== "") &&
    (!formData.flagsFlares || formData.flagsFlaresDetails.trim() !== "") &&
    (!formData.reflectiveTriangles ||
      formData.reflectiveTrianglesDetails.trim() !== "") &&
    (formData.others !== "requiresRepair" ||
      formData.othersDefectDetails.trim() !== "");

  const isNextDisabled = !isAnyChecked || !areDetailsValid;

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    dispatch(
      updatePreTripForm({
        ...preTripFormData,
        safety: formData,
      })
    );
    router.push("/pre-trip-trailer");
  };

  const handleCheckboxToggle = (field) => {
    if (field === "allFunctioning") {
      const newValue = !formData.allFunctioning;
      setFormData({
        ...formData,
        allFunctioning: newValue,
        fireExtinguisher: newValue ? false : formData.fireExtinguisher,
        flagsFlares: newValue ? false : formData.flagsFlares,
        reflectiveTriangles: newValue ? false : formData.reflectiveTriangles,
        fireExtinguisherDetails: newValue
          ? ""
          : formData.fireExtinguisherDetails,
        flagsFlaresDetails: newValue ? "" : formData.flagsFlaresDetails,
        reflectiveTrianglesDetails: newValue
          ? ""
          : formData.reflectiveTrianglesDetails,
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

  const handleRadioToggle = (value) => {
    setFormData({
      ...formData,
      others: value,
      othersDefectDetails:
        value === "requiresRepair" ? formData.othersDefectDetails : "",
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
              index <= 10
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
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Safety Equipment</Text>
        <Text style={styles.subtitle}>
          Check to ensure that all are functioning.
        </Text>
        <Text style={styles.description}>
          Safety Equipment includes: Fire Extinguisher, Flags - Flares - Fuses,
          Reflective Triangles
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
            style={{ marginBottom: 10 }}
          />
          <CustomCheckbox
            checked={formData.fireExtinguisher}
            onPress={() => handleCheckboxToggle("fireExtinguisher")}
            label="Fire Extinguisher"
            style={{ marginBottom: 10 }}
          />
          <CustomCheckbox
            checked={formData.flagsFlares}
            onPress={() => handleCheckboxToggle("flagsFlares")}
            label="Flags - Flares - Fuses"
            style={{ marginBottom: 10 }}
          />
          <CustomCheckbox
            checked={formData.reflectiveTriangles}
            onPress={() => handleCheckboxToggle("reflectiveTriangles")}
            label="Reflective Triangles"
            style={{ marginBottom: 10 }}
          />
        </View>

        {formData.fireExtinguisher && (
          <CustomInput
            label="Fire Extinguisher Details"
            placeholder="Enter Fire Extinguisher Details"
            value={formData.fireExtinguisherDetails}
            onChangeText={(text) =>
              setFormData({ ...formData, fireExtinguisherDetails: text })
            }
            icon={<Ionicons name="flame-outline" size={20} color="#082640" />}
          />
        )}
        {formData.flagsFlares && (
          <CustomInput
            label="Flags - Flares - Fuses Details"
            placeholder="Enter Flags - Flares - Fuses Details"
            value={formData.flagsFlaresDetails}
            onChangeText={(text) =>
              setFormData({ ...formData, flagsFlaresDetails: text })
            }
            icon={<Ionicons name="flag-outline" size={20} color="#082640" />}
          />
        )}
        {formData.reflectiveTriangles && (
          <CustomInput
            label="Reflective Triangles Details"
            placeholder="Enter Reflective Triangles Details"
            value={formData.reflectiveTrianglesDetails}
            onChangeText={(text) =>
              setFormData({ ...formData, reflectiveTrianglesDetails: text })
            }
            icon={
              <Ionicons name="triangle-outline" size={20} color="#082640" />
            }
          />
        )}

        <View style={styles.radioSection}>
          <Text style={styles.radioLabel}>
            Others<Text style={{ color: "#B70101" }}>*</Text>
          </Text>
          <View style={styles.radioGroup}>
            <CustomRadioButton
              label="No Other Notes"
              selected={formData.others === "noOtherNotes"}
              onPress={() => handleRadioToggle("noOtherNotes")}
              style={styles.radioOption}
              labelStyle={styles.radioText}
            />
            <CustomRadioButton
              label="Requires Repair"
              selected={formData.others === "requiresRepair"}
              onPress={() => handleRadioToggle("requiresRepair")}
              style={styles.radioOption}
              labelStyle={styles.radioText}
            />
          </View>
          {formData.others === "requiresRepair" && (
            <CustomInput
              label="Other Defect Details"
              placeholder="Enter details for other defect"
              value={formData.othersDefectDetails}
              onChangeText={(text) =>
                setFormData({ ...formData, othersDefectDetails: text })
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
  radioSection: {
    marginVertical: 15,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioText: {
    fontSize: 14,
  },
});

export default PreTripFormSafety;
