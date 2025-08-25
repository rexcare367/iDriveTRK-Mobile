import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const savePreTripToFirestore = async (userId, dateString, formData) => {
  const docRef = doc(db, "preTrips", userId, "dates", dateString);
  await setDoc(docRef, {
    ...formData,
    timestamp: new Date().toISOString(),
  });
};

export const savePostTripToFirestore = async (userId, dateString, formData) => {
  const docRef = doc(db, "postTrips", userId, "dates", dateString);
  await setDoc(docRef, {
    ...formData,
    timestamp: new Date().toISOString(),
  });
};

export const saveClockOutData = async (userId, dateString, data) => {
  const docRef = doc(db, "workSessions", userId, "dates", dateString);
  await setDoc(
    docRef,
    {
      ...data,
      timestamp: new Date().toISOString(),
    },
    { merge: true }
  );
};

export const getLastClockOutTime = async (userId) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split("T")[0];

    const yesterdayDocRef = doc(
      db,
      "workSessions",
      userId,
      "dates",
      yesterdayString
    );
    const yesterdayDocSnap = await getDoc(yesterdayDocRef);

    if (yesterdayDocSnap.exists()) {
      const yesterdayData = yesterdayDocSnap.data();
      return {
        timestamp: yesterdayData.clockOutTime || yesterdayData.timestamp,
        breakDuration: yesterdayData.breakDuration,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting last clock out time:", error);
    return null;
  }
};
