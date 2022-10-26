import express from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
} from "../controllers/employee.js";
import {verifyAdmin} from "../utils/verifyToken.js"
const router = express.Router();

//CREATE
router.post("/:id/:userId", createEmployee);

//UPDATE
router.put("/:id", updateEmployee);

//DELETE
router.delete("/:id", deleteEmployee);
//GET

router.get("/:id", getEmployee);
//GET ALL

router.get("/", getEmployees);


export default router;