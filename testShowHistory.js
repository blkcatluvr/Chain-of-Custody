const { decryptData } = require("./encryptionUtil.js");
const caseTracker = require("./caseTracker.js");

module.exports = async function (callback) {
  try {
    const args = process.argv.slice(2);
    const caseIDIndex = args.indexOf("-c") + 1;
    const itemIDIndex = args.indexOf("-i") + 1;
    const numEntriesIndex = args.indexOf("-n") + 1;
    const reverseIndex = args.indexOf("-r");
    const passwordIndex = args.indexOf("-p") + 1;

    const password = args[passwordIndex];
    const validArgs = ["-c", "-i", "-n", "-r", "-p"];
    args.forEach((arg, index) => {
      if (arg.startsWith("-") && !validArgs.includes(arg)) {
        console.error(`Invalid argument: ${arg}`);
        process.exit(1);
      }
    });
    const Migrations = artifacts.require("Migrations");
    const instance = await Migrations.deployed();
    const valid = await instance.validPasswords(password);
    const blocks = caseTracker.getAllCases();
    let filteredBlocks = blocks;

    // Quick check at the top to filter out the first block if caseID or itemID are not zero
    if (caseIDIndex > 0 || itemIDIndex > 0) {
      const caseID = caseIDIndex > 0 ? args[caseIDIndex] : null;
      const itemID = itemIDIndex > 0 ? args[itemIDIndex] : null;

      filteredBlocks = filteredBlocks.filter((block, index) => {
        if (index === 0) {
          // Filter out the first block if the arguments are not zero
          if ((caseID && caseID !== "0") || (itemID && itemID !== "0")) {
            return false;
          }
          return true;
        }
        let caseMatch = true;
        let itemMatch = true;
        if (caseID) {
          caseMatch = decryptData(block.caseID).toString() === caseID.toString();
        }
        if (itemID) {
          itemMatch = decryptData(block.itemID).toString() === itemID.toString();
        }
        return caseMatch && itemMatch;
      });
    }

    if (numEntriesIndex > 0) {
      const numEntries = parseInt(args[numEntriesIndex], 10);
      if (!isNaN(numEntries)) {
        filteredBlocks = filteredBlocks.slice(0, numEntries);
      }
    }

    if (reverseIndex > -1) {
      filteredBlocks.reverse();
    }
    if (valid) {
      filteredBlocks.forEach((block) => {
        console.log(`Case: ${decryptData(block.caseID)}`);
        console.log(`Item: ${decryptData(block.itemID)}`);
        console.log(`Action: ${block.status}`);
        console.log(`Time: ${block.time}\n`);
      });
    } else if (passwordIndex === 0 || !valid) {
      console.log(`Invalid Password`)
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
};
