/**
 * # This function was generated with assistance from ChatGPT, an AI tool developed by OpenAI.
# Reference: OpenAI. (2024). ChatGPT [Large language model]. openai.com/chatgpt
 */
const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'cases.json');

// Function to load existing cases from file
function loadCases() {
    if (fs.existsSync(FILE_PATH)) {
        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    }
    return [];
}

// Function to save cases to file
function saveCases(cases) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(cases, null, 2));
}

// Function to add a new case to the array
function addCase(caseID, itemID, status, time) {
    const cases = loadCases(); // Load the latest version of cases
    cases.push({
        caseID,
        itemID,
        status,
        time
    });
    saveCases(cases); // Save changes to file
}

// Function to get all cases
function getAllCases() {
    return loadCases();
}

// Function to get all cases with the same itemID
function getItemsByID(itemID) {
    const cases = loadCases();
    return cases.filter((c) => c.itemID === itemID);
}

// Function to reset cases to an empty array
function resetCases() {
    saveCases([]);
}

// New function to get unique itemIDs for a given caseID
function getUniqueItemsByCaseID(caseID) {
    const cases = loadCases();
    const itemIDs = new Set();

    cases.forEach((c) => {
        if (c.caseID === caseID) {
            itemIDs.add(c.itemID);
        }
    });

    return Array.from(itemIDs); // Convert Set to an array if needed
}

// Export the functions to be used in other files
module.exports = {
    addCase,
    getAllCases,
    getItemsByID,
    resetCases,
    getUniqueItemsByCaseID
};

