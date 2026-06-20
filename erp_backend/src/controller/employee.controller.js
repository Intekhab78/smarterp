const db = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const ResponseFormatter = require("../utils/ResponseFormatter");

const Employee = db.Employee;
const WorkDetails = db.Work_details;
const PersonalDetails = db.Personal_Details;
const emp_fam_member = db.emp_fam_member;
const PayrollDetails = db.Payroll_details;
const EmployeeDocuments = db.employee_documents;

// ==================== CREATE EMPLOYEE ====================
const createEmployee = async (req, res) => {
  try {
    const {
      emp_title,
      emp_fname,
      emp_lname,
      emp_email,
      emp_phone,
      emp_address,
      emp_department,
      emp_designation,
      companyCode,
      locationId,
      department,
      subDepartment,
      position,
      title,
      manager,
      work_address,
    } = req.body;

    // Handle file uploads
    let profilePicFile = null;
    let resumeFile = null;

    // if (req.files) {
    //   if (req.files.emp_profile_pic) {
    //     profilePicFile = req.files.emp_profile_pic[0].filename;
    //   }
    //   if (req.files.resume) {
    //     resumeFile = req.files.resume[0].filename;
    //   }
    // }
    if (req.files && req.files.length > 0) {
      const profilePic = req.files.find(
        (f) => f.fieldname === "emp_profile_pic",
      );
      const resume = req.files.find((f) => f.fieldname === "resume");

      profilePicFile = profilePic ? profilePic.filename : null;
      resumeFile = resume ? resume.filename : null;
    }

    // Create employee
    const employee = await Employee.create({
      emp_title,
      emp_fname,
      emp_lname,
      emp_email,
      emp_phone,
      emp_address,
      emp_department: 0,
      emp_designation,
      emp_profile_pic: profilePicFile,
    });

    // Create linked work details
    const work = await WorkDetails.create({
      emp_id: employee.emp_id,
      companyCode,
      locationId,
      department,
      subDepartment,
      position,
      title,
      manager,
      work_address,
      resume: resumeFile,
    });

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Employee created successfully",
          "",
          { employee, work },
        ),
      );
  } catch (error) {
    console.error("❌ Error creating employee:", error);
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong",
          "Error",
          error.message,
        ),
      );
  }
};

// ==================== LIST EMPLOYEES ====================
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [
        {
          model: PayrollDetails,
          as: "payroll_details",
          attributes: ["status"],
        },
        {
          model: WorkDetails,
          as: "work",
        },
      ],
    });

    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Employees fetched successfully",
          "",
          employees,
        ),
      );
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong",
          "Error",
          error.message,
        ),
      );
  }
};

// ==================== VIEW EMPLOYEE BY ID ====================
const getEmployeeById = async (req, res) => {
  try {
    const { emp_id } = req.params;
    const employee = await Employee.findByPk(emp_id, {
      include: [
        { model: WorkDetails, as: "work" },
        // { model: PersonalDetails, as: "personal_details" },
        {
          model: PersonalDetails,
          as: "personal_details",
          include: [
            {
              model: emp_fam_member,
              as: "familyMembers",
            },
          ],
        },
        { model: PayrollDetails, as: "payroll_details" },
        { model: EmployeeDocuments, as: "employee_documents" },
      ],
    });

    if (!employee) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "Employee not found",
            "Error",
            "",
          ),
        );
    }

    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Employee fetched successfully",
          "",
          employee,
        ),
      );
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong",
          "Error",
          error.message,
        ),
      );
  }
};

// ==================== VIEW EMPLOYEE BY Email ====================

const getEmployeeByEmail = async (req, res) => {
  try {
    const { emp_email } = req.params;
    console.log("emails is ----------", emp_email);

    const employee = await Employee.findOne({
      where: { emp_email },
      include: [
        { model: WorkDetails, as: "work" },
        // { model: PersonalDetails, as: "personal_details" },
        {
          model: PersonalDetails,
          as: "personal_details",
          include: [
            {
              model: emp_fam_member,
              as: "familyMembers",
            },
          ],
        },
        { model: PayrollDetails, as: "payroll_details" },
        { model: EmployeeDocuments, as: "employee_documents" },
      ],
    });

    if (!employee) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "Employee not found",
            "Error",
            "",
          ),
        );
    }

    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Employee fetched successfully",
          "",
          employee,
        ),
      );
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong",
          "Error",
          error.message,
        ),
      );
  }
};

// ==================== UPDATE EMPLOYEE ====================
const updateEmployee = async (req, res) => {
  try {
    const { emp_id } = req.params;
    const employee = await Employee.findByPk(emp_id);
    if (!employee)
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "Employee not found",
            "Error",
            "",
          ),
        );

    const {
      emp_title,
      emp_fname,
      emp_lname,
      emp_email,
      emp_phone,
      emp_address,
      emp_department,
      emp_designation,
      companyCode,
      locationId,
      department,
      subDepartment,
      position,
      title,
      manager,
      work_address,
    } = req.body;

    // Handle new uploads
    let profilePicFile = employee.emp_profile_pic;
    let resumeFile = null;

    if (req.files && req.files.length > 0) {
      const profilePic = req.files.find(
        (f) => f.fieldname === "emp_profile_pic",
      );
      const resume = req.files.find((f) => f.fieldname === "resume");

      if (profilePic) profilePicFile = profilePic.filename;
      if (resume) resumeFile = resume.filename;
    }

    await employee.update({
      emp_title,
      emp_fname,
      emp_lname,
      emp_email,
      emp_phone,
      emp_address,
      emp_department,
      emp_designation,
      emp_profile_pic: profilePicFile,
    });

    let work = await WorkDetails.findOne({ where: { emp_id } });
    if (work) {
      await work.update({
        companyCode,
        locationId,
        department,
        subDepartment,
        position,
        title,
        manager,
        work_address,
        resume: resumeFile || work.resume,
      });
    } else {
      await WorkDetails.create({
        emp_id,
        companyCode,
        locationId,
        department,
        subDepartment,
        position,
        title,
        manager,
        work_address,
        resume: resumeFile,
      });
    }

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Employee updated successfully",
          "",
          { employee, work },
        ),
      );
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong",
          "Error",
          error.message,
        ),
      );
  }
};

// ==================== DELETE EMPLOYEE ====================
const deleteEmployee = async (req, res) => {
  try {
    const { emp_id } = req.params;
    const employee = await Employee.findByPk(emp_id);
    if (!employee)
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "Employee not found",
            "Error",
            "",
          ),
        );

    // Optional: delete files
    const uploadPath = path.join(
      __dirname,
      "../public/uploads/Employee_profile",
    );
    if (employee.emp_profile_pic)
      fs.unlinkSync(path.join(uploadPath, employee.emp_profile_pic));

    await employee.destroy();

    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Employee deleted successfully",
          "",
          "",
        ),
      );
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong",
          "Error",
          error.message,
        ),
      );
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeByEmail,
};
