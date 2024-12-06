/**
 * # This function was generated with assistance from ChatGPT, an AI tool developed by OpenAI.
# Reference: OpenAI. (2024). ChatGPT [Large language model]. openai.com/chatgpt
 */
const { encryptData ,decryptData } = require("./encryptionUtil.js");
const caseTracker = require('./caseTracker.js');

module.exports = async function (callback) {
    try {
        const args = process.argv.slice(2);

        const itemIDIndex = args.indexOf("-i") + 1;
        const reasonIndex = args.indexOf("-y") + 1;
        const passwordIndex = args.indexOf("-p") + 1;

        if (itemIDIndex === 0 || reasonIndex === 0 || passwordIndex === 0) {
            console.error("Missing required arguments. Use: -i <item_id> -y <reason> -p <password>");
            process.exit(1);
        }

        const validArgs = ["-i", "-y", "-p"];
        args.forEach((arg, index) => {
            if (arg.startsWith("-") && !validArgs.includes(arg)) {
                console.error(`Invalid argument: ${arg}`);
                process.exit(1);
            }
        });
        
        // Extract and encrypt inputs
        let itemID = args[itemIDIndex];
        let reason = args[reasonIndex]; let hashedReason = args[reasonIndex];
        let reasonHex = web3.utils.asciiToHex(reason);

        // Manually pad to 12 bytes (24 hex characters)
        if (reasonHex.length < 26) {
            hashedReason = reasonHex.padEnd(26, '0'); // 2 characters per byte, and we need 12 bytes total
        } else {
            hashedReason = reasonHex.substring(0, 26); // Ensure it's exactly 12 bytes (24 hex characters)
        }
        const password = args[passwordIndex];

        itemID = parseInt(itemID, 10);

        let encryptedItemID = encryptData(itemID); 
        function base64ToBytes32(base64String) {
            // Decode Base64 to Buffer
            const buffer = Buffer.from(base64String, 'base64');
            if (buffer.length > 32) {
                throw new Error("Encrypted data exceeds 32 bytes!");
            }
            // Ensure that buffer is exactly 32 bytes
            return web3.utils.bytesToHex(Buffer.concat([buffer, Buffer.alloc(32 - buffer.length)]));
        }
        const itemIDBytes32 = base64ToBytes32(encryptedItemID);

        // Fetch the deployed contract
        const Migrations = artifacts.require("Migrations");
        const instance = await Migrations.deployed();

        // Call the remove function
        await instance.remove(itemIDBytes32, hashedReason, password);
        
        const matchingID = caseTracker.getItemsByID(encryptedItemID)[0];
        console.log(`> Case: ${decryptData(matchingID.caseID)}`);
        console.log(`> Removed item: ${decryptData(matchingID.itemID)}`);
        console.log(`> Status: ${reason}`);
        console.log(`> Time of action: ${new Date().toISOString()}
`);
        caseTracker.addCase(matchingID.caseID, encryptedItemID, reason, new Date().toISOString());

    } catch (err) {
        const revertReason = err.message.split("revert")[1].trim();
        console.log(">", revertReason);
    }
};
