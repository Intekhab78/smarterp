const multer = require("multer");
const path = require("path");
const fs = require("fs");

const getUploadFolder = (req) => {
  const route = req.baseUrl;
  const uploadFolders = {
    "/api/festival": "./public/uploads/festival",
    "/api/sponsor": "./public/uploads/sponsor",
    "/api/program": "./public/uploads/program",
    "/api/information": "./public/uploads/information",
    "/api/nationality": "./public/uploads/nationality",
    "/api/ticket": "./public/uploads/tickets",
    "/api/market_place": "./public/uploads/markets",
    "/api/ticket_purchases": "./public/uploads/ticket_purchase",
    "/api/stand": "./public/uploads/stand",
    "/api/admin-app-setting": "./public/uploads/comSetting",
    "/api/ecommerce": "./public/uploads/ecommerce", //in this it has some issue
    "/api/test": "./public/uploads/ecommerce", // this is working
    "/api/item": "./public/uploads/itemsImage", // this is working
    "/api/item_location_master": "./public/uploads/itemsImage", // this is working
    "/api/item_loc_master_img": "./public/uploads/itemsImage", // this is working
    // "/api/item_loc_master_img": "./public/uploads/itemsImage", // this is working

    "/api/item_department": "./public/uploads/catImage", // this is working
    "/api/vendor": "./public/uploads/vendor_docs", // ✅ add this line
    "/api/employee": "./public/uploads/Employee_profile", // ✅ add this line
    "/api/certification": "./public/uploads/Employee_certificate", // ✅ add this line
    "/api/documents": "./public/uploads/Employee_documents", // ✅ add this line
    "/api/ecomBanner": "./public/uploads/Website_Banner", // ✅ add this line
    "/api/email_campaign": "./public/uploads/Email_Campaign", // ✅ add this line
    "/api/video-advertiesment": "./public/adds", // ✅ add this line

    "/api": "./public/uploads/userProfile",
    // ... add other routes here
  };
  const relativePath = uploadFolders[route] || "public/uploads";
  const absolutePath = path.join(process.cwd(), relativePath);

  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath, { recursive: true });
  }
  return absolutePath;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getUploadFolder(req));
  },
  // filename: (req, file, cb) => {
  //   cb(
  //     null,
  //     file.fieldname + "-" + Date.now() + path.extname(file.originalname)
  //   );
  // },

  filename: (req, file, cb) => {
    const name = path.parse(file.originalname).name; // 'test'
    const ext = path.extname(file.originalname); // '.mp4'
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, ""); // e.g. '20260113183030'
    const newFilename = `${name}-${timestamp}${ext}`; // 'test-20260113183030.mp4'
    cb(null, newFilename);
  },
});

// const allowedMimes = [
//   "image/jpeg",
//   "image/png",
//   "image/jpg",
//   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   "application/vnd.ms-excel",
// ];

const allowedMimes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",

  // videos
  "video/mp4",
  "video/mpeg",
  "video/quicktime", // .mov
  "video/webm",
];

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (allowedMimes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error("Only image or excel files allowed!"));
//     }
//   },
// });

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Only image, PDF, Word , Excel or Video  files allowed!"),
        false
      );
    }
  },
});

module.exports = {
  storage,
  upload,
};
