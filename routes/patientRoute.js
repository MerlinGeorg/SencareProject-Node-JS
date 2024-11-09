import express from "express";
import { fetch,create, fetchPatientById, fetchPatientClinicalData } from "../controller/patientController.js";

const route = express.Router();

route.get("/fetch",fetch)

route.post("/create",create)

route.get("/fetch/:id",fetchPatientById)

route.get("/fetch/:id/clinical-data",fetchPatientClinicalData)

export default route;