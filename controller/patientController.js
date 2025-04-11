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
          return res.status(200).json(updatePatient)
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
        return res.status(201).json({message: "Patient deleted successfully"})
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


export const editMedicalRecord = async (req, res) => {
    try {
        const patientId = req.params.id;
        const clinicalDataId = req.body._id;
        const updatedData = req.body;

        if (!clinicalDataId) {
            return res.status(400).json({ message: "Clinical data ID is required" });
        }

        // Find the patient
        const patient = await Patient.findOne({ _id: patientId });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Prepare the update object
        const updateObject = {};
        if (updatedData.date_time) {
            updateObject["clinical_data.$.date_time"] = updatedData.date_time;
        }
        if (updatedData.type_of_data) {
            updateObject["clinical_data.$.type_of_data"] = updatedData.type_of_data;
        }
        if (updatedData.reading) {
            updateObject["clinical_data.$.reading"] = updatedData.reading;
        }
        if (updatedData.unit) {
            updateObject["clinical_data.$.unit"] = updatedData.unit;
        }

        // Find and update the specific clinical data entry in the array
        const result = await Patient.findOneAndUpdate(
            { _id: patientId, "clinical_data._id": clinicalDataId },
            {
                $set: updateObject,
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: "Patient or clinical data not found" });
        }

        return res.status(200).json({
            message: "Clinical data updated successfully",
            updatedClinicalData: result.clinical_data,
        });

    } catch (error) {
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
};
