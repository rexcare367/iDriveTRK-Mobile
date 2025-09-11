import idriveLogo from "@/assets/logo/idrive.png";
import BackgroundEffects from "@/components/BackgroundEffects";
import BottomTabBar from "@/components/BottomTabBar";
import CustomButton from "@/components/CustomButton";
import Header from "@/components/Header";
import { updateTripStopStatus } from "@/redux/actions/driverActions";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function ScanTagScreen() {
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  const { tripStops } = useSelector((state: any) => state.driver);
  const { stopId, stopName, tripName } = params;
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const isAMTrip = tripName.includes("AM");

  const filteredTripStops = tripStops.filter((stop: any) =>
    isAMTrip ? stop.tripType === "AM" : stop.tripType === "PM"
  );

  const handleScan = () => {
    setScanning(true);

    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 2000);
  };
  const handleContinue = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    const timeString = `${
      hours < 10 ? "0" + hours : hours
    }:${minutesStr} ${ampm}`;

    dispatch(updateTripStopStatus(stopId, timeString));
    const currentIndex = filteredTripStops.findIndex(
      (stop: any) => stop.id === stopId
    );
    const nextStop = filteredTripStops
      .slice(currentIndex + 1)
      .find((stop: any) => stop.status === "pending");

    if (nextStop) {
      router.push({
        pathname: "/(home)/scan-tag",
        params: {
          stopId: nextStop.id,
          stopName: nextStop.name,
          tripName,
        },
      });
    } else {
      // if (isAMTrip) {
      //   navigation.navigate("DutyStatus", { tripName });
      // } else {
      router.push("/post-trip-screen");
      // }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundEffects />
      <Header />

      <View style={styles.content}>
        <Text style={styles.title}>Scan Tag</Text>
        <Text style={styles.subtitle}>{stopName}</Text>

        <View style={styles.scanContainer}>
          {!scanning && !scanned ? (
            <>
              <View style={styles.scanFrame}>
                <QRCode
                  value={tripName}
                  size={180}
                  logo={idriveLogo}
                  logoSize={60}
                  logoBackgroundColor="transparent"
                />
              </View>
              <Text style={styles.scanInstructions}>
                Position the QR code within the frame to scan
              </Text>
              <CustomButton
                title="Scan Tag"
                onPress={handleScan}
                loading={scanning}
                disabled={scanning}
              />
            </>
          ) : scanning ? (
            <>
              <View style={styles.scanningFrame}>
                <Ionicons name="scan" size={100} color="#004B87" />
              </View>
              <Text style={styles.scanningText}>Scanning...</Text>
            </>
          ) : (
            <>
              <View style={styles.successFrame}>
                <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
              </View>
              <Text style={styles.successText}>Tag scanned successfully!</Text>
              <CustomButton title="Continue" onPress={handleContinue} />
            </>
          )}
        </View>
      </View>

      <BottomTabBar activeTab="Home" />
    </SafeAreaView>
  );
}

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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  scanContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#004B87",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  scanningFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#004B87",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    borderStyle: "dashed",
  },
  successFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  scanInstructions: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  scanningText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004B87",
    marginBottom: 30,
  },
  successText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 30,
  },
});
