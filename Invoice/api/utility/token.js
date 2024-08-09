import jwt from "jsonwebtoken";

export const createToken = (payload, exp) => {

    const token = jwt.sign(payload, process.env.JWT_SECRECT, {
        expiresIn : exp
    });
    return token;

}

export const createAdminToken = (payload, exp) => {

    const token = jwt.sign(payload, process.env.JWT_ADMIN_SECRET, {
        expiresIn : exp
    });
    return token;

}

export const verifyAdminToken = (token) => {

    return jwt.verify(token, process.env.JWT_ADMIN_SECRET);

}

export const verifyToken = (token) => {

    return jwt.verify(token, process.env.JWT_SECRECT);

}
