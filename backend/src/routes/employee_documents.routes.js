const express = require("express");
const router = express.Router();
const employeeDocumentsController = require("../controller/employee_documents.controller");
const { upload } = require("../UploadFile"); // dynamic folder multer

// ==================== GET DOCUMENTS BY EMPLOYEE ====================
router.get(
  "/list/:employeeId/documents",
  employeeDocumentsController.getDocumentsByEmployee
);

// ==================== CREATE OR UPDATE DOCUMENTS ====================
// Using upload.array("files") to handle multiple files
router.post(
  "/createOrUpdate/:employeeId/documents",
  upload.array("files"), // Multer middleware
  employeeDocumentsController.createOrUpdateDocuments
);

// ==================== DELETE DOCUMENT ====================
router.delete("/delete/:id", employeeDocumentsController.deleteDocument);

module.exports = router;
