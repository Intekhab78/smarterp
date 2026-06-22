const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/uploads");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     //console.log(file.mimetype)
//     if (
//       (file.mimetype == "image/jpeg" ||
//         file.mimetype == "image/png" ||
//         file.mimetype == "image/jpg",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       "application/vnd.ms-excel")
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error("Only image file format allowed!"));
//     }
//   },
// });

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image or Excel file formats allowed!"), false);
    }
  },
});

module.exports = {
  storage,
  upload,
};
