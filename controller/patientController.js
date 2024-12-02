import Patient from "../model/patientModel.js";

//add new patient
export const create = async(req,res)=>{
    try{
        const patientData = new Patient(req.body);
        const {admission_number} = patientData;
        const patientExists = await Patient.findOne({admission_number})
        if(patientExists){
            return res.status(400).json({message: "Patient already exists"})
        }
        const savedPatient = await patientData.save();
        return res.status(200).json(savedPatient)
    }catch(error){
        return res.status(500).json({error: "Internal server error", details: error.message})
    }
}

//list all patients
export const fetch = async(req,res)=>{
    try{
        const patients = await Patient.find();
        if(patients.length === 0){
            return res.status(400).json({message: "Patient not found"})
        }
        return res.status(200).json(patients)
    }catch(error){
        return res.status(500).json({error: "Internal server error", details: error.message})
    }
}

//get patient by id
export const fetchPatientById = async(req,res)=>{
    try{
        const id =req.params.id
        const patient = await Patient.findOne({_id:id});
        if(!patient){
            return res.status(400).json({message: "Patient not found"})
        }
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(patient)
    }catch(error){
        return res.status(500).json({error: "Internal server error", details: error.message})
    }
}

//update patient details by id
export const updatePatient = async(req,res)=>{
    try{
        const id =req.params.id
        const patientExists = await Patient.findOne({_id:id});
        if(!patientExists){
            return res.status(404).json({message: "Patient not found"})
        }
        const updatePatient = await Patient.findByIdAndUpdate(id,
            req.body, {new: true}); //creates new record if record not found
            res.status(201).json(updatePatient)
    }catch(error){
        return res.status(500).json({error: "Internal server error"})
    }
}


//delete patient by id
export const deletePatient = async(req,res)=>{
    try{
        const id = req.params.id
        const patientExists = await Patient.findOne({_id:id})
        if(!patientExists){
            res.status(404).json({message: "Patient not found"})
        }
        await Patient.findByIdAndDelete(id);
        res.status(201).json({message: "Patient deleted successfully"})
    }catch(error){
        return res.status(500).json({error:"Internal server error"})
    }
}

//get patient's tests by id
export const fetchPatientClinicalData = async(req,res)=>{
    try{
        const id =req.params.id
        const patient = await Patient.findOne({_id:id});
        if(!patient){
            return res.status(400).json({message: "Patient not found"})
        }
        return res.status(200).json(patient.clinical_data)
    }catch(error){
        return res.status(500).json({error: "Internal server error", details: error.message})
    }
}

//add tests for patient
export const createMedicalRecord = async(req,res)=>{
    try{
        const id =req.params.id
        const patientExists = await Patient.findOne({_id:id});
        if(patientExists){
            const newClinicalData = req.body.clinical_data;

            if (!newClinicalData) {
                return res.status(400).json({ message: "Clinical data is required" });
            }

            // Add new clinical data to the patient's clinical_data array
            const updatedPatient = await Patient.findByIdAndUpdate(
                id,
                {
                    $push:
                    //  { clinical_data: newClinicalData }
                    { clinical_data: { $each: newClinicalData } }
                },
                { new: true } // return the updated patient
            );
            res.status(201).json(updatedPatient)
        } else {
            return res.status(400).json({message: "Patient does not exists"})
        }
       
    }catch(error){
        return res.status(500).json({error: "Internal server error", details: error.message})
    }
}