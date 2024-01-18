const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const allowedOrigins = ["https://htl-demo.onrender.com"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
dotenv.config();
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("mongodb connected");
});
PORT = process.env.PORT || 4554;
app.use("/user", require("./routes/userRoutes"));
app.use("/post", require("./routes/postRoutes"));
app.listen(PORT, () => {
  console.log(`Server Running ${PORT}`);
});
