// refer for setup steps -> https://firebase.google.com/docs/admin/setup
import admin from "firebase-admin";
// check why import does not work
const serviceAccountKey = require("../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  // credential: applicationDefault(),
  // databaseURL: "https://highlevel-scheduler-assignment.firebaseio.com",
});

const db = admin.firestore();

export { db };
