import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name!"]
    },

    email: {
        type: String,
        required: [true, "Please enter your Email address!"]
    },

    password: {
        type: String,
        required: [true, "Please enter your password!"],
        minLength: [6, "Password should be greater than 6 characters!"],
        select: false
    },

    phone: {
        type: Number
    },

    addresses: [
        {
            country: {
                type: String
            },
            city: {
                type: String
            },
            address1: {
                type: String
            },
            address2: {
                type: String,
            },
            zipCode: {
                type: Number,
            },
            addressType: {
                type: String,
            },
        }
    ],

    role: {
        type: String,
        enum: ["user"],
        default: "user"
    },

    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
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
});


// hash password
userSchema.pre("save", async (next) => {
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
userSchema.methods.getJwtToken = () => {
    return jwt.sign({id: this._id}, process.env.JWT_SECRECT, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// compare password
userSchema.methods.comparePassword = async (enteredPassword) => {
    return await bcrypt.compare(enteredPassword, this.password);
}


const userModel = mongoose.model("users", userSchema);
export default userModel;
