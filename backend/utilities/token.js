import jwt from "jsonwebtoken";


export const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9999).toString();

    return jwt.sign({user, activationCode}, process.env.ACTIVATION_SECRET, {
        expiresIn: "10m"
    })
}

export const verifyActivationToken = (activationToken) => {
    return jwt.verify(
        activationToken,
        process.env.ACTIVATION_SECRET
    );
}

export const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();
    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "none",
        secure: true
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token
    });
}

