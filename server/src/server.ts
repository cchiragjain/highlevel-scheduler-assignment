import dotenv from "dotenv";
import app from "./app";
import { checkFirestoreConnection } from "./utils/check-firestore-connection";
dotenv.config();

const PORT = process.env.PORT || 7373;

checkFirestoreConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is up and running on port: ${PORT}`);
  });
});

// console.log(buildSlotsForGivenDate("2025-05-12"));
