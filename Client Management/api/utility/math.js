/**
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */

// create activation code
export const getRandomCode = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

// create random username
export const getRandomUsernameCode = (name, min, max) => {
    return name + "-" + Math.floor(Math.random() * (max - min)) + min;
}

