import mongoose from "mongoose";
const patientSchema = new mongoose.Schema({
  //to create a schema for the table
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  health_status: {
    type: String,
    required: true,
  },
  admission_date: {
    type: Date,
    required: true,
  },
  admission_number: {
    type: String,
    required: true,
    unique: true,
  },
  room_number: {
    type: Number,
    required: true,
  },
  photo: {
    type: String,
  },
  health_conditions: {
    type: String,
  },
  clinical_data: [{
    date_time: {
      type: Date,
    },
    type_of_data: {
      type: String,
    },
    reading: {
      type: String,
    },
  }],
});
export default mongoose.model("patients", patientSchema); //uses patients table
