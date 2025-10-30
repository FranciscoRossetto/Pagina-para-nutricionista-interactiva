import { Router } from "express";
import { createAppointment, listAppointments, deleteAppointment } from "../controllers/appointmentController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, listAppointments);
router.post("/", authMiddleware, createAppointment);
router.delete("/:id", authMiddleware, deleteAppointment);

export default router;
