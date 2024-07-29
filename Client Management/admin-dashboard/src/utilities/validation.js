


export const isPassword = (password) => {

    const pattern = /^[a-zA-Z0-9-_?><~`!@#$%^&*()=+/\\\]{};:'" ]{6,}$/;
    const checkPassword = pattern.test(password);
    return checkPassword

}

