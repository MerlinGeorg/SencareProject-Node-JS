import Patient from "../model/patientModel.js";
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
        return res.status(200).json(patient)
    }catch(error){
        return res.status(500).json({error: "Internal server error", details: error.message})
    }
}

//get patient by id
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