import mongoose from "mongoose";
const Schema = mongoose.Schema;


// Employee Schema for hours breakdown
const employeeSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    avatar: { 
        type: String 
    },
    status: { 
        type: Boolean, 
        default: false 
    }
}, {
    timestamps : true
});

export const employeeWorkModel = mongoose.model('employees', employeeSchema);

