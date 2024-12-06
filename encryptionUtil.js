/**
 * # This function was generated with assistance from ChatGPT, an AI tool developed by OpenAI.
# Reference: OpenAI. (2024). ChatGPT [Large language model]. openai.com/chatgpt
 */
// Import required libraries
const crypto = require('crypto');

// AES key provided in the project instructions
let aesKey = Buffer.from('R0chLi4uLi4uLi4=', 'base64');
if (aesKey.length < 16) {
    aesKey = Buffer.concat([aesKey, Buffer.alloc(16 - aesKey.length)]);
}

// Pad function to make text align with AES block size (16 bytes)
function pad(text) {
    const paddingLength = 16 - (text.length % 16);
    return Buffer.concat([text, Buffer.alloc(paddingLength, paddingLength)]);
}

// Unpad function to remove padding after decryption
function unpad(text) {
    const paddingLength = text[text.length - 1];
    return text.slice(0, -paddingLength);
}

// Encryption function for UUIDs and 4-byte item IDs
function encryptData(data) {
    // Create a new AES cipher object in ECB mode
    const cipher = crypto.createCipheriv('aes-128-ecb', aesKey, Buffer.alloc(0));
    cipher.setAutoPadding(false);

    // Convert the data to bytes if it's a UUID or integer (item ID)
    let dataBytes;
    if (typeof data === 'string' && data.length === 36) { // UUID
        dataBytes = Buffer.from(data.replace(/-/g, ''), 'hex');
    } else if (typeof data === 'number') { // 4-byte item ID
        dataBytes = Buffer.alloc(4);
        dataBytes.writeUInt32BE(data);
    } else {
        throw new Error('Data must be either a UUID or a 4-byte integer');
    }

    // Pad the data to align with the block size and encrypt
    const paddedData = pad(dataBytes);
    const encryptedData = Buffer.concat([cipher.update(paddedData), cipher.final()]);
    return encryptedData.toString('base64');
}

// Decryption function for UUIDs and 4-byte item IDs
function decryptData(encryptedData) {
    // Create a new AES decipher object in ECB mode
    const decipher = crypto.createDecipheriv('aes-128-ecb', aesKey, Buffer.alloc(0));
    decipher.setAutoPadding(false);

    // Decode the encrypted data from base64 and decrypt
    const encryptedDataBytes = Buffer.from(encryptedData, 'base64');
    const decryptedData = Buffer.concat([decipher.update(encryptedDataBytes), decipher.final()]);
    const unpaddedData = unpad(decryptedData);

    // Determine if the unpadded data represents a UUID or a 4-byte integer
    if (unpaddedData.length === 16) {
        return unpaddedData.toString('hex').match(/.{1,8}/g).join('-');
    } else if (unpaddedData.length === 4) {
        return unpaddedData.readUInt32BE(0);
    } else {
        throw new Error('Decrypted data does not match expected length');
    }
    
}

module.exports = {
    encryptData,
    decryptData
};

