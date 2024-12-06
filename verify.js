/**
 * # This function was generated with assistance from ChatGPT, an AI tool developed by OpenAI.
# Reference: OpenAI. (2024). ChatGPT [Large language model]. openai.com/chatgpt
 */
const { encryptData, decryptData } = require("./encryptionUtil.js");
const caseTracker = require("./caseTracker.js");

module.exports = async function (callback) {
    try {
        const Migrations = artifacts.require("Migrations");
        const instance = await Migrations.deployed();
        let blockCount = await instance.blockCount();

        // Call the verify function in the Solidity contract
        const isValid = await instance.verify();
        console.log("Done")
        // Output the result
        if (isValid) {
            console.log(`Transactions in blockchain: ${blockCount}`);
            console.log(`> CLEAN`);
        } else {
            console.log(`Transactions in blockchain: ${blockCount}`);
            console.log(`> ERROR`);
            console.log(`BAD BLOCK`)
        }
    } catch (err) {
        console.error("> An error occurred during verification:");
        console.error(err.message);
    }
};
