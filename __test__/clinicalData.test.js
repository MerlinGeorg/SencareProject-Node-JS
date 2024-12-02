import Patient from "../model/patientModel.js";
import * as patientController from "../controller/patientController.js";

// Mock the Patient model
jest.mock('../model/patientModel.js')

describe('Patient Controller', ()=>{
    let req,res;
    beforeEach(()=>{
        req = {
            body: {},
            params: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            setHeader: jest.fn()
            
        }
    });

    afterEach(()=>{
        jest.clearAllMocks()
    });

    describe('fetchPatientClinicalData', () => {
        it('should fetch patient clinical data', async () => {

          // Mock patient data with clinical information
          const mockPatient = { id: 'patientId', clinical_data: [{ test: 'Test 1' }] };
           // Set up mock to return the patient when findOne is called
          Patient.findOne.mockResolvedValue(mockPatient);
    
          req.params.id = 'patientId';
    
          await patientController.fetchPatientClinicalData(req, res);
    
          expect(Patient.findOne).toHaveBeenCalledWith({ _id: 'patientId' });
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith(mockPatient.clinical_data);
        });
    
        it('should return 400 if patient not found', async () => {
          Patient.findOne.mockResolvedValue(null);
    
          req.params.id = 'nonExistentId';
    
          await patientController.fetchPatientClinicalData(req, res);
    
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({ message: 'Patient not found' });
        });
      });
    
      describe('createMedicalRecord', () => {
        it('should add clinical data to a patient', async () => {
          const mockPatient = { id: 'patientId', clinical_data: [] };
          const updatedPatient = { ...mockPatient, clinical_data: [{ test: 'New Test' }] };
          Patient.findOne.mockResolvedValue(mockPatient);
          Patient.findByIdAndUpdate.mockResolvedValue(updatedPatient);
    
          req.params.id = 'patientId';
          req.body = { clinical_data: [{ test: 'New Test' }] };
    
          await patientController.createMedicalRecord(req, res);
    
          expect(Patient.findOne).toHaveBeenCalledWith({ _id: 'patientId' });
          expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
            'patientId',
            { $push: { clinical_data: { $each: [{ test: 'New Test' }] } } },
            { new: true }
          );
          expect(res.status).toHaveBeenCalledWith(201);
          expect(res.json).toHaveBeenCalledWith(updatedPatient);
        });
    
        it('should return 400 if patient does not exist', async () => {
          Patient.findOne.mockResolvedValue(null);
    
          req.params.id = 'nonExistentId';
    
          await patientController.createMedicalRecord(req, res);
    
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({ message: 'Patient does not exists' });
        });
    
        it('should return 400 if clinical data is missing', async () => {
          Patient.findOne.mockResolvedValue({ id: 'patientId' });
    
          req.params.id = 'patientId';
          req.body = {};
    
          await patientController.createMedicalRecord(req, res);
    
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({ message: 'Clinical data is required' });
        });
      });
});