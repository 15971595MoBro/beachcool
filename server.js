require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const { isObject } = require("util");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
io.on("connection", (socket) => {
  console.log("Connected ready");
});

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//Routes
app.use("/user", require("./routes/userRouter"));
app.use("/api", require("./routes/categoryRouter"));
app.use("/api", require("./routes/upload"));
app.use("/api", require("./routes/productRouter"));
app.use("/api", require("./routes/paymentRouter"));
app.use("/api", require("./routes/manualPaymentRouter"));
app.use("/api", require("./routes/contactRouter"));

//Connect To Mongoose
const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected To DB");
  }
);

app.get("/", (req, res, next) => {
  res.send({ msg: "Wellcom To HA JNb JSBv" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is Running On Port ${PORT}`);
});
