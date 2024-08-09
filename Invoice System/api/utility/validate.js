
export const isEmail = (email) => {
    return /^[a-z0-9-_\.]{1,}@[a-z0-9]{1,}\.[a-z\.]{2,}$/.test(email);
}

export const isPhone = (phone) => {
    return /^(01|\+8801|8801)[0-9]{9}$/.test(phone);
}


