import Patient from "../model/patientModel.js";
import * as patientController from "../controller/patientController.js";

// Mock the Patient model
jest.mock('../model/patientModel.js')

describe('Patient Controller', ()=>{
    let req,res;

    // Set up request and response objects before each test
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

    // Clear all mock functions after each test
    afterEach(()=>{
        jest.clearAllMocks()
    });


    describe('create', ()=>{
        it('should create a new patient', async() => {
            const mockPatient = { admission_number: '12345', save: jest.fn().mockResolvedValue({ id: 'newId' }) };
      Patient.findOne.mockResolvedValue(null);
      Patient.mockImplementation(() => mockPatient);

      req.body = { admission_number: '12345' };

      await patientController.create(req, res);

      expect(Patient.findOne).toHaveBeenCalledWith({ admission_number: '12345' });
      expect(mockPatient.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 'newId' });
    });

    it('should return 400 if patient already exists', async () => {
      Patient.findOne.mockResolvedValue({ id: 'existingId' });

      req.body = { admission_number: '12345' };

      await patientController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient already exists' });
    });
  });


  describe('fetch', () => {
    it('should fetch all patients', async () => {
      const mockPatients = [{ id: '1' }, { id: '2' }];
      Patient.find.mockResolvedValue(mockPatients);

      await patientController.fetch(req, res);

      expect(Patient.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPatients);
    });

    it('should return 400 if no patients found', async () => {
      Patient.find.mockResolvedValue([]);

      await patientController.fetch(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient not found' });
    });
  });
  

  describe('fetchPatientById', () => {
    it('should fetch a patient by id', async () => {
      const mockPatient = { id: 'patientId' };
      Patient.findOne.mockResolvedValue(mockPatient);

      req.params.id = 'patientId';

      await patientController.fetchPatientById(req, res);

      expect(Patient.findOne).toHaveBeenCalledWith({ _id: 'patientId' });
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPatient);
    });

    it('should return 400 if patient not found', async () => {
      Patient.findOne.mockResolvedValue(null);

      req.params.id = 'nonExistentId';

      await patientController.fetchPatientById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient not found' });
    });
  });

  describe('updatePatient', () => {
    it('should update a patient', async () => {
      const mockUpdatedPatient = { id: 'patientId', name: 'Updated Name' };
      Patient.findOne.mockResolvedValue({ id: 'patientId' });
      Patient.findByIdAndUpdate.mockResolvedValue(mockUpdatedPatient);

      req.params.id = 'patientId';
      req.body = { name: 'Updated Name' };

      await patientController.updatePatient(req, res);

      expect(Patient.findOne).toHaveBeenCalledWith({ _id: 'patientId' });
      expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith('patientId', req.body, { new: true });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedPatient);
    });

    it('should return 404 if patient not found', async () => {
      Patient.findOne.mockResolvedValue(null);

      req.params.id = 'nonExistentId';

      await patientController.updatePatient(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient not found' });
    });
  });

  describe('deletePatient', () => {
    it('should delete a patient', async () => {
      Patient.findOne.mockResolvedValue({ id: 'patientId' });
      Patient.findByIdAndDelete.mockResolvedValue();

      req.params.id = 'patientId';

      await patientController.deletePatient(req, res);

      expect(Patient.findOne).toHaveBeenCalledWith({ _id: 'patientId' });
      expect(Patient.findByIdAndDelete).toHaveBeenCalledWith('patientId');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient deleted successfully' });
    });

    it('should return 404 if patient not found', async () => {
      Patient.findOne.mockResolvedValue(null);

      req.params.id = 'nonExistentId';

      await patientController.deletePatient(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient not found' });
    });
  });

  
})
