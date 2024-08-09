import mongoose from "mongoose";


const userDataSchema = mongoose.Schema({

    name : {
        type : String,
        required : true,
        trim : true
    },
    
    email : {
        type : String,
        unique : true,
        trim : true,
        required: true
    },

    phone : {
        type : String,
        trim : true
    },

    username : {
        type : String,
        unique : true,
        trim : true
    },

    password : {
        type : String,
        required : true,
        trim : true
    },

    birthDate : {
        type : String
    },

    birthMonth : {
        type : String
    },

    birthYear : {
        type : String
    },

    gender : {
        type : String,
        enum : ['male', 'female', 'other']
    },

    avatar : {
        type : String,
        default : null
    },

    role: {
        type: String,
        enum: ["admin"],
        default: "admin"
    },

    reports : {
        type : Array,
        default : []
    },

    accessToken :{
        type : String
    },

    isActivate :{
        type : String,
        default: false
    },
    
    createdAt: {
        type: Date,
        default: Date.now()
    },

    resetPasswordToken: {
        type: String
    },

    resetPasswordTime: {
        type: String
    }

}, {
    timestamps : true
});



const userModel = mongoose.model('admin', userDataSchema);

export default userModel;


