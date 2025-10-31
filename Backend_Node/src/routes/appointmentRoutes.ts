import { Router } from "express";
import {
  createAppointment,
  listAppointments,
  deleteAppointment,
  takenSlots,
} from "../controllers/appointmentController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Mis turnos
router.get("/", authMiddleware, listAppointments);
router.post("/", authMiddleware, createAppointment);
router.delete("/:id", authMiddleware, deleteAppointment);

// Ocupación anónima para el calendario público
router.get("/taken", takenSlots);   // no requiere login

export default router;
