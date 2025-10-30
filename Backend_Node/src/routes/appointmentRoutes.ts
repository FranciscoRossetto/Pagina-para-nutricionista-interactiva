import { Router } from "express";
import { createAppointment, listAppointments, deleteAppointment } from "../controllers/appointmentController";
import { auth } from "../middlewares/auth";

const router = Router();

router.get("/", auth, listAppointments);
router.post("/", auth, createAppointment);
router.delete("/:id", auth, deleteAppointment);

export default router;
