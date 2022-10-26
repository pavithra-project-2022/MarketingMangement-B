import express from "express";
import {
  createDcm,
  deleteDcm,
  getDcm,
  getDcms,
  updateDcm,
  getDcmDetailsSingleUser,
  searchDcm
} from "../controllers/dcm.js";

const router = express.Router();
//CREATE
router.post("/:userId", createDcm);

//UPDATE
router.put("/:id", updateDcm);
//DELETE
router.delete("/:id", deleteDcm);
//GET

router.get("/:id", getDcm);
//GET ALL

router.get("/", getDcms);

router.post("/search", searchDcm);

router.get("/dcmUser/:id", getDcmDetailsSingleUser);

export default router;