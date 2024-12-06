/**
 * # This function was generated with assistance from ChatGPT, an AI tool developed by OpenAI.
# Reference: OpenAI. (2024). ChatGPT [Large language model]. openai.com/chatgpt
 */
const { decryptData } = require("./encryptionUtil.js");
const caseTracker = require('./caseTracker.js');

module.exports = async function (callback) {
    try {
        const args = process.argv.slice(2);
        const passwordIndex = args.indexOf("-p") + 1;

        const Migrations = artifacts.require("Migrations");
        const instance = await Migrations.deployed();
        const password = args[passwordIndex];
        const valid = await instance.validPassword(password);

        let blocks = caseTracker.getAllCases(); 
        const uniqueCaseIDs = new Set(blocks.map(block => block.caseID));
        blocks = Array.from(uniqueCaseIDs).map(caseID => {
            return blocks.find(block => block.caseID === caseID);
        });

        if (passwordIndex === 0 || !valid) {
            blocks.forEach(function(block) {
                console.log(`Case: ${block.caseID}`);
            });
        } else if (valid) {
            blocks.forEach(function(block) {
                console.log(`Case: ${decryptData(block.caseID)}`);
            });
        }
    } catch (err) {
        const revertReason = err.message.split("revert")[1].trim();
        console.log(">", revertReason);
    }
};
