import app from "./app";
import { db } from "./config/firebase";
const PORT = process.env.PORT || 7373;

// TODO: should be moved to utils type folder if more such functions are created
const checkFirestoreConnection = async () => {
  try {
    await db.collection("check").limit(1).get();
    console.log("firestore connection works");
  } catch (error) {
    console.log("firestore connection not working", error);
    process.exit(1);
  }
};

checkFirestoreConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is up and running on port: ${PORT}`);
  });
});
