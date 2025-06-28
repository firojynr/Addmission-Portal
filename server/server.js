const express = require("express");
const app = express();
const cors = require("cors");
const index = require("./routes/authRoutes");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use("/", index);
const PORT = process.env.PORT;
console.log(PORT);
app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
  connectDB();
});
