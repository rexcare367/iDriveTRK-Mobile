import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import BackgroundEffects from "@/components/BackgroundEffects";
import BottomTabBar from "@/components/BottomTabBar";
import CustomButton from "@/components/CustomButton";
import Header from "@/components/Header";

import { updatePostTripForm } from "@/redux/actions/driverActions";

import { api } from "@/utils";

const PostTripFormPhotos = () => {
  const dispatch = useDispatch();
  const { postTripFormData } = useSelector((state: any) => state.driver);

  const [formData, setFormData] = useState({
    frontPhoto: postTripFormData?.frontPhoto || null,
    leftSidePhoto: postTripFormData?.leftSidePhoto || null,
    rearPhoto: postTripFormData?.rearPhoto || null,
    rightSidePhoto: postTripFormData?.rightSidePhoto || null,
  });

  const allPhotosUploaded =
    !!formData.frontPhoto &&
    !!formData.leftSidePhoto &&
    !!formData.rearPhoto &&
    !!formData.rightSidePhoto;

  const handleNext = () => {
    dispatch(updatePostTripForm({ ...postTripFormData, ...formData }));
    router.push("/post-trip-engine");
  };

  const handleUpload = async (photoType: string) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result;
    try {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
    } catch {
      alert("Camera failed to launch. Please try again.");
      return;
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (!uri) {
        alert("No image returned from camera.");
        return;
      }

      const response = await fetch(uri);
      const blob = await response.blob();

      let fileExtension = "jpg";

      let mimeType;

      // Determine correct MIME type based on file extension
      switch (fileExtension) {
        case "jpg":
        case "jpeg":
          mimeType = "image/jpeg";
          break;
        case "png":
          mimeType = "image/png";
          break;
        case "heic":
          mimeType = "image/heic";
          break;
        default:
          throw new Error(`Unsupported file format: ${fileExtension}`);
      }
      const filename = `${photoType}-${Date.now()}.${fileExtension}`;

      const formDataUpload: any = new FormData();

      formDataUpload.append("file", {
        uri,
        type: mimeType,
        name: filename,
        data: blob,
      });

      await api.post(`/api/truck-inspection/upload-photo`, formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      setFormData({
        ...formData,
        [photoType]: result.assets[0].uri,
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
              index <= 2
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
        title="Vehicle Inspection Report"
        subtitle="As required by the DOT Federal Motor Carrier Service Regulations"
      />

      <ScrollView style={styles.content}>
        {renderProgressBar()}

        <View style={styles.photoSection}>
          <Text style={styles.photoLabel}>
            Front of Truck<Text style={{ color: "#B70101" }}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.photoUpload}
            onPress={() => handleUpload("frontPhoto")}
          >
            {formData.frontPhoto ? (
              <Image
                source={{ uri: formData.frontPhoto }}
                style={styles.photoPreview}
              />
            ) : (
              <>
                <MaterialCommunityIcons name="upload" size={24} color="#666" />
                <Text style={styles.photoUploadText}>
                  Drag and drop your image or click here to upload
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.photoSection}>
          <Text style={styles.photoLabel}>
            Left Side of Truck<Text style={{ color: "#B70101" }}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.photoUpload}
            onPress={() => handleUpload("leftSidePhoto")}
          >
            {formData.leftSidePhoto ? (
              <Image
                source={{ uri: formData.leftSidePhoto }}
                style={styles.photoPreview}
              />
            ) : (
              <>
                <MaterialCommunityIcons name="upload" size={24} color="#666" />
                <Text style={styles.photoUploadText}>
                  Drag and drop your image or click here to upload
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.photoSection}>
          <Text style={styles.photoLabel}>
            Rear of Truck<Text style={{ color: "#B70101" }}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.photoUpload}
            onPress={() => handleUpload("rearPhoto")}
          >
            {formData.rearPhoto ? (
              <Image
                source={{ uri: formData.rearPhoto }}
                style={styles.photoPreview}
              />
            ) : (
              <>
                <MaterialCommunityIcons name="upload" size={24} color="#666" />
                <Text style={styles.photoUploadText}>
                  Drag and drop your image or click here to upload
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.photoSection}>
          <Text style={styles.photoLabel}>
            Right Side of Truck<Text style={{ color: "#B70101" }}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.photoUpload}
            onPress={() => handleUpload("rightSidePhoto")}
          >
            {formData.rightSidePhoto ? (
              <Image
                source={{ uri: formData.rightSidePhoto }}
                style={styles.photoPreview}
              />
            ) : (
              <>
                <MaterialCommunityIcons name="upload" size={24} color="#666" />
                <Text style={styles.photoUploadText}>
                  Drag and drop your image or click here to upload
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Next"
          onPress={handleNext}
          // disabled={!allPhotosUploaded}
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
  photoSection: {
    marginBottom: 20,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  photoUpload: {
    height: 120,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  photoUploadText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
});

export default PostTripFormPhotos;
