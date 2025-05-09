import app from "./app";
const PORT = process.env.PORT || 7373;
app.listen(PORT, () => {
  console.log(`Server is up and running on port: ${PORT}`);
});
