"use strict";
const db = require("../models");
const fs = require("fs");
const path = require("path");
const ResponseFormatter = require("../utils/ResponseFormatter");
const { upload } = require("../UploadFile"); // dynamic folder multer

const EmployeeDocuments = db.employee_documents;

// ==================== CREATE OR UPDATE DOCUMENTS ====================
const createOrUpdateDocuments = async (req, res) => {
  try {
    if (!req.body.rows)
      return res
        .status(400)
        .json({ success: false, message: "'rows' field is required" });

    const { employeeId } = req.params;
    const parsedRows = JSON.parse(req.body.rows);

    if (!parsedRows || !employeeId)
      return res.status(400).json({ success: false, message: "Invalid data" });

    const updatedDocs = [];

    for (let i = 0; i < parsedRows.length; i++) {
      const doc = parsedRows[i];
      const file = req.files[i];
      const filePath = file ? `/uploads/documents/${file.filename}` : null;

      if (doc.id) {
        const existingDoc = await EmployeeDocuments.findByPk(doc.id);
        if (existingDoc) {
          if (filePath && existingDoc.filePath) {
            const oldFile = path.join(
              __dirname,
              "../public",
              existingDoc.filePath
            );
            if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
          }
          await existingDoc.update({
            document: doc.document,
            documentNumber: doc.documentNumber,
            issuedBy: doc.issuedBy,
            expiry: doc.expiry,
            visaType: doc.visaType,
            visaCountry: doc.visaCountry,
            filePath: filePath || existingDoc.filePath,
          });
          updatedDocs.push(existingDoc);
        }
      } else {
        const newDoc = await EmployeeDocuments.create({
          emp_id: employeeId,
          document: doc.document,
          documentNumber: doc.documentNumber,
          issuedBy: doc.issuedBy,
          expiry: doc.expiry,
          visaType: doc.visaType,
          visaCountry: doc.visaCountry,
          filePath,
        });
        updatedDocs.push(newDoc);
      }
    }

    return res.status(201).json({ success: true, data: updatedDocs });
  } catch (error) {
    console.error("❌ Create/Update documents error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET DOCUMENTS BY EMPLOYEE ====================
const getDocumentsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const documents = await EmployeeDocuments.findAll({
      where: { emp_id: employeeId },
    });

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Documents fetched successfully",
          "",
          documents
        )
      );
  } catch (error) {
    console.error("❌ Fetch documents error:", error);
    return res
      .status(500)
      .json(
        ResponseFormatter.setResponse(
          false,
          500,
          "Something went wrong",
          "Error",
          error.message
        )
      );
  }
};

// ==================== DELETE DOCUMENT ====================
const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await EmployeeDocuments.findByPk(id);

    if (!doc)
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "Document not found",
            "Error",
            ""
          )
        );

    if (doc.filePath) {
      const fileFullPath = path.join(__dirname, "../public", doc.filePath);
      if (fs.existsSync(fileFullPath)) fs.unlinkSync(fileFullPath);
    }

    await doc.destroy();

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Document deleted successfully",
          "",
          ""
        )
      );
  } catch (error) {
    console.error("❌ Delete document error:", error);
    return res
      .status(500)
      .json(
        ResponseFormatter.setResponse(
          false,
          500,
          "Something went wrong",
          "Error",
          error.message
        )
      );
  }
};

module.exports = {
  createOrUpdateDocuments,
  getDocumentsByEmployee,
  deleteDocument,
};
