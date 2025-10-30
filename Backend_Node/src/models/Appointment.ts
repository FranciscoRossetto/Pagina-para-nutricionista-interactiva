import { Schema, model, Document } from "mongoose";

export interface IAppointment extends Document {
  owner: string;
  fecha: string;
  inicio: string;
  fin: string;
  paciente: string;
  motivo: "consulta" | "control" | "plan" | "otro";
  notas?: string;
  createdAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    owner: { type: String, required: true, index: true },
    fecha: { type: String, required: true, index: true },
    inicio: { type: String, required: true },
    fin: { type: String, required: true },
    paciente: { type: String, required: true },
    motivo: { type: String, enum: ["consulta", "control", "plan", "otro"], required: true },
    notas: { type: String },
  },
  { timestamps: true }
);

appointmentSchema.index({ owner: 1, fecha: 1, inicio: 1 }, { unique: true });

export const Appointment = model<IAppointment>("Appointment", appointmentSchema);
