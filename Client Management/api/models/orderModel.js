import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Client Schema
const clientSchema = new Schema({
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

// Work Schema
const workSchema = new Schema({
    description: { 
        type: String, 
        required: true 
    },
    hours: { 
        type: Number, 
        required: true 
    },
    hourlyRate: { 
        type: Number, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    }
}, {
    timestamps : true
});

// Employee Schema for hours breakdown
const employeeSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    hoursBreakdown: { 
        type: Number, 
        required: true 
    },
    hoursAdjustment: { 
        type: Number, 
        required: true 
    }
});

// Order Schema
const orderSchema = new Schema({
    projectName: {
        type: String, 
        required: true
    },
    clientCompany: {
        type: String, 
        required: true
    },
    client: { 
        type: Schema.Types.ObjectId, 
        ref: 'client', 
        required: true 
    },
    works: [workSchema],
    employeeWorks: [employeeSchema],
    status: { 
        type: String, 
        enum: ['Unpaid', 'Paid'], 
        default: 'Unpaid' 
    },
    issueDate: { 
        type: Date, 
        default: Date.now 
    },
    totalAmount: { 
        type: Number, 
        required: true 
    },
    invoiceNumber: { 
        type: String, 
        required: true,
        unique: true
    },
    month: { 
        type: String, 
        required: true 
    },
    submittedOn: { 
        type: Date
    },
    freelancerName: { 
        type: String, 
        required: true 
    },
    freelancerCompany: { 
        type: String, 
        required: true 
    },
    freelancerCountry: { 
        type: String, 
        required: true 
    },
    totalHours: { 
        type: Number, 
        required: true 
    },
    subTotal: { 
        type: Number, 
        required: true 
    },
    adjustments: { 
        type: Number, 
        default: 0
    },
    finalTotalPayable: { 
        type: Number, 
        required: true 
    },
    paymentStatus: {
        type: Boolean,
        default: false
    }
}, {
    timestamps : true
});

export const clientModel = mongoose.model('client', clientSchema);
export const orderModel = mongoose.model('order', orderSchema);

