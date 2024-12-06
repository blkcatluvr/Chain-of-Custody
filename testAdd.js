/**
 * # This function was generated with assistance from ChatGPT, an AI tool developed by OpenAI.
# Reference: OpenAI. (2024). ChatGPT [Large language model]. openai.com/chatgpt
 */
const { encryptData} = require("./encryptionUtil.js");
const caseTracker = require('./caseTracker.js');
const testInit = require('./testInit.js'); // Import the init file

module.exports = async function (callback) {
    try {
        // Parse command-line arguments manually
        const args = process.argv.slice(2);

        const caseIDIndex = args.indexOf("-c") + 1;
        const itemIDsIndex = args.indexOf("-i") + 1;
        const creatorIndex = args.indexOf("-g") + 1;
        const passwordIndex = args.indexOf("-p") + 1;

        if (caseIDIndex === 0 || itemIDsIndex === 0 || creatorIndex === 0 || passwordIndex === 0) {
            console.error("Missing required arguments. Use: -c <case_id> -i <item_ids> -g <creator> -p <password>");
            process.exit(1);
        }

        const validArgs = ["-i", "-g", "-p", "-c"];
        args.forEach((arg, index) => {
            if (arg.startsWith("-") && !validArgs.includes(arg)) {
                console.error(`Invalid argument: ${arg}`);
                process.exit(1);
            }
        });

        const caseID = args[caseIDIndex];
        const creator = args[creatorIndex];
        const password = args[passwordIndex];

        // Parse item IDs as all arguments between `-i` and the next flag
        const nextFlagIndex = Math.min(
            ...[args.indexOf("-c", itemIDsIndex), args.indexOf("-g", itemIDsIndex), args.indexOf("-p", itemIDsIndex)]
                .filter((index) => index > itemIDsIndex) // Ignore -1 or invalid indices
        );
        let itemIDs = args.slice(itemIDsIndex, nextFlagIndex > 0 ? nextFlagIndex : undefined);

        // Convert itemIDs to integers to ensure proper data type
        itemIDs = itemIDs.map((id) => {
            const intID = parseInt(id, 10);
            if (isNaN(intID)) {
                throw new Error(`Item ID "${id}" is not a valid integer`);
            }
            return intID;
        });

        // Encrypt the inputs
        const encryptedCaseID = encryptData(caseID);
        const encryptedItemIDs = itemIDs.map((id) => encryptData(id));

        function base64ToBytes32(base64String) {
            // Decode Base64 to Buffer
            const buffer = Buffer.from(base64String, 'base64');
            if (buffer.length > 32) {
                throw new Error("Encrypted data exceeds 32 bytes!");
            }
            // Ensure that buffer is exactly 32 bytes
            return web3.utils.bytesToHex(Buffer.concat([buffer, Buffer.alloc(32 - buffer.length)]));
        }

        const caseIDBytes32 = base64ToBytes32(encryptedCaseID);
        const itemIDsBytes32 = encryptedItemIDs.map(base64ToBytes32);

        // Fetch the deployed contract
        const Migrations = artifacts.require("Migrations");
        const instance = await Migrations.deployed();

        // Call the add function
        const blocks = await instance.blockCount();
        if(blocks.toNumber().toString() === "0".toString()){
            await instance.init();
            caseTracker.resetCases();
            caseTracker.addCase(0, 0, "INITIAL", new Date().toISOString());
            console.log("Blockchain file not found. Created INITIAL block.");
        }
        await instance.add(caseIDBytes32, itemIDsBytes32, web3.utils.asciiToHex(creator), password);
        itemIDs.forEach((id) => {
            console.log(`> Added item: ${id}`);
            console.log("> Status: CHECKEDIN");
            console.log(`> Time of action: ${new Date().toISOString()}\n`);
            caseTracker.addCase(encryptedCaseID, encryptData(id), "CHECKEDIN", new Date().toISOString());
        });

    } catch (err) {
        const revertReason = err.message.split("revert")[1].trim();
        console.log(">", revertReason);
    }
};


