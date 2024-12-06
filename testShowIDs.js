/**
 * # This function was generated with assistance from ChatGPT, an AI tool developed by OpenAI.
# Reference: OpenAI. (2024). ChatGPT [Large language model]. openai.com/chatgpt
 */
const { encryptData ,decryptData } = require("./encryptionUtil.js");
const caseTracker = require('./caseTracker.js');

module.exports = async function (callback) {
    try {
        const args = process.argv.slice(2);

        const caseIDIndex = args.indexOf("-c") + 1;

        if (caseIDIndex === 0) {
            console.error("Missing required arguments. Use: -c <case_id>");
            process.exit(1);
        }

        const validArgs = ["-c"];
        args.forEach((arg, index) => {
            if (arg.startsWith("-") && !validArgs.includes(arg)) {
                console.error(`Invalid argument: ${arg}`);
                process.exit(1);
            }
        });
        const caseID = args[caseIDIndex];
        const itemIDs = caseTracker.getUniqueItemsByCaseID(encryptData(caseID));
        if(itemIDs.length === 0){console.error("Invalid CASE ID")}
        itemIDs.forEach(function(itemID) {
            if (itemID !== undefined) {
            console.log(`Item iD: ${(itemID)}`);
            }
        });

    } catch (err) {
        const revertReason = err.message.split("revert")[1].trim();
        console.log(">", revertReason);
    }
    
};
