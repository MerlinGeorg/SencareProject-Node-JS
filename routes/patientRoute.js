import express from "express";
import { fetch,create, fetchPatientById, fetchPatientClinicalData, createMedicalRecord } from "../controller/patientController.js";

const route = express.Router();

route.get("/fetch",fetch)

route.post("/create",create)

route.get("/fetch/:id",fetchPatientById)

route.get("/fetch/:id/clinical-data",fetchPatientClinicalData)

route.post("/create/:id/clinical-data",createMedicalRecord)

export default route;