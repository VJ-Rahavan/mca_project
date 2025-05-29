import CryptoJS from "crypto-js";

export const decryptDetails = (data) => {
    if (data) {
        const bytes = CryptoJS.AES.decrypt(
            data.toString(),
            process.env.SECRET_KEY
        );
        const result = bytes.toString(CryptoJS.enc.Utf8).replace("|", /\\/g);
        return result;
    } else {
        return null;
    }
};

/**
 * async function for encrypting the tokens and id details
 */
export const encryptDetails = (data) => {
    if (data) {
        const text = CryptoJS.AES.encrypt(
            data.toString(),
            process.env.SECRET_KEY
        ).toString();
        return text.replace(/\\/g, "|");
    } else {
        return null;
    }
};

export function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}