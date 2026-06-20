const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const router = require("./routes/index.js");
const db = require("./models");
const { setupAdViewerTracking } = require("./socket/adViewerTracker");
const cookieParser = require("cookie-parser");

// 🔹 NEW IMPORTS (Socket)
const http = require("http");
const { Server } = require("socket.io");
const { currentAd } = require("./controller/video.controller");



dotenv.config();

const app = express();
const port = process.env.PORT || 5610;

// 🔹 Create HTTP server (required for socket.io)
const server = http.createServer(app);

// 🔹 Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // testing safe
  },
});
app.set("io", io);
setupAdViewerTracking(io);



const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://jtserp.info",
  "https://shop.jtserp.info",
  "https://charity.jtserp.info",
  "https://admin.jtsmiddleeast.com",
  "https://retail.jtserp.info",
  "https://islamicbookzone.com",
  "https://admin.jtserp.info",
];

const corsOptions1 = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow Postman, curl, etc.
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    // add any custom headers your frontend sends here
  ],
};


const corsOptions = {
  origin: (origin, callback) => {
    // ✅ Allow PayU callbacks & server-to-server
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, true); // 🔥 DO NOT BLOCK
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
};




// ✅ Allow PayU callbacks without CORS
app.use("/api/payment/payu-success", (req, res, next) => {
  next();
});
app.use("/api/payment/payu-failure", (req, res, next) => {
  next();
});


//app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (
    req.originalUrl.includes("/payment/payu-success") ||
    req.originalUrl.includes("/payment/payu-failure")
  ) {
    return next(); // ✅ bypass CORS
  }
  return cors(corsOptions)(req, res, next);
});


app.options("*", cors(corsOptions));
app.use(cookieParser()); // ✅ REQUIRED


//app.use(cors(corsOptions));
//app.options("*", cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//app.use("/", express.static(path.resolve(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/ads", express.static(path.join(__dirname, "../public/ads")));
app.use("/", express.static(path.resolve(__dirname, "../public")));

app.use("/api", router);


io.on("connection", (socket) => {
  console.log("🖥️ Store connected:", socket.id);

  socket.on("register-store", (storeName) => {
    socket.join("ALL_STORES"); // ✅ FIXED
    console.log(`✅ ${storeName} joined ALL_STORES`);

    // 🔥 Send currently running ad
    if (currentAd) {
      console.log("🔁 Sending current ad to new store");
      socket.emit("PLAY_AD", currentAd);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Store disconnected:", socket.id);
  });
});


app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.statusCode || 500).json({ error: err.message || "Internal Server Error" });
});

db.sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database connection failed:", err));

//app.listen(port, "0.0.0.0", () => {
  //console.log(`🚀 Server running at port ${port}, env: ${process.env.NODE_ENV}`);
//});


server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running at port ${port}`);
});

