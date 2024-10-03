import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
  deleteUserAccount,
} from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/change-password", authenticateToken, changePassword);
router.delete("/delete", authenticateToken, deleteUserAccount);

export default router;
