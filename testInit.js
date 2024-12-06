/**
 * # This function was generated with assistance from ChatGPT, an AI tool developed by OpenAI.
# Reference: OpenAI. (2024). ChatGPT [Large language model]. openai.com/chatgpt
 */
const caseTracker = require('./caseTracker.js');
module.exports = async function (callback) {
  try {
      // Fetch the contract
      const ChainOfCustody = artifacts.require("Migrations");
      const instance = await ChainOfCustody.deployed();

      // Step 1: Call the init function
      try {
          await instance.init();
          caseTracker.resetCases();
          caseTracker.addCase(0, 0, "INITIAL", new Date().toISOString());
          console.log("Blockchain file not found. Created INITIAL block.");

      } catch (initError) {
          console.log("Blockchain file found with INITIAL block.");
      }
  } catch (err) {
      console.error("An error occurred:", err.message);
      callback(err);
  }
};
