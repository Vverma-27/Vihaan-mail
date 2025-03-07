import express from "express";
import {
  getAllSentEmails,
  getAllDraftEmails,
  getEmailById,
  sendEmail,
  createDraft,
  deleteMail,
  updateEmail,
} from "../controllers/emailController";
import { authenticateJWT } from "../middleware";

const router = express.Router();

router.use(authenticateJWT);

// List routes (without body content)
router.get("/sent", getAllSentEmails);
router.get("/drafts", getAllDraftEmails);

// Single email route (with body content)
router.get("/:id", getEmailById);

// Action routes
router.post("/send", sendEmail);
router.post("/draft", createDraft);
router.delete("/:id", deleteMail);
router.put("/:id", updateEmail);

export default router;
