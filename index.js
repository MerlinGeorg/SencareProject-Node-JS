import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import route from "./routes/patientRoute.js"
import swaggerJsdoc from "swagger-jsdoc"; //for converting the comments in the code to meaningful ui
import swaggerUi from "swagger-ui-express"; //for creating swagger ui for our api

const app = express();
app.use(bodyParser.json()); //intercepter
dotenv.config();

const swaggerDefinition = {
    openapi: "3.0.0",
    info:{
        title: "User API",
        version: "1.0.0.",
        description: "API documentation for managing user API"
    },
    servers: [
        {
            url: "http://localhost:5000" //your local server
        }
    ]
};

const options = {
    swaggerDefinition,
    apis: ["./routes/*.js", "./controller/*.js"]
};

const swaggerSpec = swaggerJsdoc(options)

//swagger UI route
app.use("/api-docs", swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
)


const port = process.env.PORT || 8000;
const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL).then(()=>{
    console.log("Connection Success");
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`)
    })
}).catch((error)=> console.log(error))


app.use("/api/patient",route); //intercepter