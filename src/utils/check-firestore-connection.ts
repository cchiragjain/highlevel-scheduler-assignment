import { db } from "../config/firebase";

// TODO: should be moved to utils type folder if more such functions are created
export const checkFirestoreConnection = async () => {
  try {
    await db.collection("check").limit(1).get();
    console.log("firestore connection works");
  } catch (error) {
    console.log("firestore connection not working", error);
    process.exit(1);
  }
};
