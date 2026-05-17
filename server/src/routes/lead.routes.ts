import express from "express";

import { createLead } from "../controllers/lead.controller";
import { getAllLeads, getLeadById, updateLead, deleteLead, exportLeadsToCSV } from "../controllers/lead.controller";


import authorizeRoles from "../middlewares/role.middleware";

import { protect } from "../middlewares/auth.middleware";


const router = express.Router();

router.post("/", protect, createLead);

router.get("/", protect, getAllLeads);

router.get(
  "/export/csv",
  protect,
  authorizeRoles("admin"),
  exportLeadsToCSV
);

router.get("/:id", protect, getLeadById);

router.put("/:id", protect, updateLead);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteLead
);

export default router;