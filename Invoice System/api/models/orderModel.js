import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Employee Schema for hours breakdown
const employeeSchemaForPerClient = new Schema({
    employee: { 
        type: Schema.Types.ObjectId, 
        ref: 'employees',
        required: true 
    },
    hoursAdjustment: { 
        type: Number,
        required: true 
    }
});

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
    employeeWorks: [employeeSchemaForPerClient],
    phone: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    company: { 
        type: String, 
    },
    avatar: { 
        type: String 
    },
    status: { 
        type: Boolean, 
        default: false 
    },
    invoiceNumber: { 
        type: String, 
        required: true,
        unique: true
    },
    billingCriteria: {
        maxHoursPerMonth: { 
            type: Number, 
            default: 360 
        },
        maxEmployees: { 
            type: Number, 
            default: 6 
        }
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

// Client Schema
const employeeForDbSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String,
    },
    address: { 
        type: String, 
    },
    avatar: { 
        type: String 
    },
    status: { 
        type: Boolean, 
        default: true 
    },
}, {
    timestamps : true
});

// Employee Schema for hours breakdown
const employeeSchema = new Schema({
    name: { 
        type: Schema.Types.ObjectId, 
        ref: 'employees', 
        required: true 
    },
    hoursBreakdown: { 
        type: Number, 
        required: true 
    },
    hoursAdjustment: { 
        type: Number, 
    }
});

// Order Schema
const orderSchema = new Schema({
    projectName: {
        type: String, 
        required: true
    },
    clientCompany: {
        type: String
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

export const employeeForDBModel = mongoose.model('employees', employeeForDbSchema);
export const employeeModel = mongoose.model('employees-work', employeeSchema);
export const clientModel = mongoose.model('client', clientSchema);
export const orderModel = mongoose.model('order', orderSchema);

