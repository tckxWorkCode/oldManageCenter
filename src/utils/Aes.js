import CryptoJS from 'crypto-js/crypto-js'

export function encrypt (msg, key, iv) {
    return  CryptoJS.AES.encrypt(msg,  key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
}


export function decrypt (cipherText, key, iv) {
    return  CryptoJS.AES.decrypt({ ciphertext: cipherText }, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC

    });
}