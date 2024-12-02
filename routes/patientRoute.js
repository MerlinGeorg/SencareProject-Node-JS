import express from "express";
import { fetch,create, fetchPatientById, fetchPatientClinicalData, 
    createMedicalRecord, deletePatient, updatePatient } from "../controller/patientController.js";

const route = express.Router();

/**
 * @swagger
 * /api/patient/fetch:
 *   get:
 *     summary: Fetch all patients
 *     description: Retrieves all patients from the database.
 *     responses:
 *       200:
 *         description: A list of patients.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   age:
 *                     type: number
 *                   health_status:
 *                     type: string
 *                   admission_date:
 *                     type: string
 *                     format: date
 *                   admission_number:
 *                     type: string
 *                   room_number:
 *                     type: number
 *                   photo:
 *                     type: string
 *                   health_conditions:
 *                     type: string
 *                   clinical_data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         date_time:
 *                           type: string
 *                           format: date-time
 *                         type_of_data:
 *                           type: string
 *                         reading:
 *                           type: string
 *       400:
 *         description: No patients found.
 *       500:
 *         description: Internal server error.
 */
route.get("/fetch", fetch)

/**
 * @swagger
 * /api/patient/create:
 *   post:
 *     summary: Create a new patient
 *     description: Adds a new patient to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - health_status
 *               - admission_date
 *               - admission_number
 *               - room_number
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               health_status:
 *                 type: string
 *               admission_date:
 *                 type: string
 *                 format: date
 *               admission_number:
 *                 type: string
 *               room_number:
 *                 type: number
 *               photo:
 *                 type: string
 *               health_conditions:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient created successfully.
 *       400:
 *         description: Patient already exists.
 *       500:
 *         description: Internal server error.
 */
route.post("/create", create)

/**
 * @swagger
 * /api/patient/fetch/{id}:
 *   get:
 *     summary: Fetch patient's details
 *     description: Retrieves patient details by id from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 age:
 *                   type: number
 *                 health_status:
 *                   type: string
 *                 admission_date:
 *                   type: string
 *                   format: date
 *                 admission_number:
 *                   type: string
 *                 room_number:
 *                   type: number
 *                 photo:
 *                   type: string
 *                 health_conditions:
 *                   type: string
 *                 clinical_data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date_time:
 *                         type: string
 *                         format: date-time
 *                       type_of_data:
 *                         type: string
 *                       reading:
 *                         type: string
 *       400:
 *         description: Patient not found.
 *       500:
 *         description: Internal server error.
 */
route.get("/fetch/:id", fetchPatientById)

/**
 * @swagger
 * /api/patient/update/{id}:
 *   put:
 *     summary: Update Patient by id
 *     description: Update existing Patient record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               health_status:
 *                 type: string
 *               admission_date:
 *                 type: string
 *                 format: date
 *               admission_number:
 *                 type: string
 *               room_number:
 *                 type: number
 *               photo:
 *                 type: string
 *               health_conditions:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found.
 *       500:
 *         description: Internal server error.
 */
route.put("/update/:id", updatePatient)

/**
 * @swagger
 * /api/patient/delete/{id}:
 *   delete:
 *     summary: Delete a Patient by id
 *     description: Delete an existing patient record from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The patient ID
 *     responses:
 *       201:
 *         description: Patient deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Patient not found.
 *       500:
 *         description: Internal server error.
 */
route.delete("/delete/:id", deletePatient)

/**
 * @swagger
 * /api/patient/fetch/{id}/clinical-data:
 *   get:
 *     summary: Fetch all medical tests for patient
 *     description: Retrieves all medical tests of patient by id from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of patient's clinical data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date_time:
 *                     type: string
 *                     format: date-time
 *                   type_of_data:
 *                     type: string
 *                   reading:
 *                     type: string
 *       400:
 *         description: Patient not found.
 *       500:
 *         description: Internal server error.
 */
route.get("/fetch/:id/clinical-data", fetchPatientClinicalData)

/**
 * @swagger
 * /api/patient/create/{id}/clinical-data:
 *   post:
 *     summary: Create new medical tests for patient
 *     description: Adds new medical tests for a patient to the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clinical_data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     date_time:
 *                       type: string
 *                       format: date-time
 *                     type_of_data:
 *                       type: string
 *                     reading:
 *                       type: string
 *     responses:
 *       201:
 *         description: Medical tests added successfully.
 *       400:
 *         description: Patient does not exist or clinical data is required.
 *       500:
 *         description: Internal server error.
 */
route.post("/create/:id/clinical-data", createMedicalRecord)

export default route