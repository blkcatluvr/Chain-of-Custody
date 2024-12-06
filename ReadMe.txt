Myles Hobbs: 1222159601
Ethan Luong: 1221892178
Group 23

Running & Testing
npm install -g npm
Download and Install Node.js
	node -v
	npm -v
Download & Install Ganache
Install Truffle Framework
	npm install -g truffle
	To verify run
	truffle version
Make sure the versions align with:
	Truffle v5.0.2 (core: 5.0.2)
	Solidity v0.5.0 (solc-js)
	Node v8.9.0
Set Up Project Directory
	mkdir blockchain-chain-of-custody
	cd blockchain-chain-of-custody
	Could be any folder name
truffle init
	This will help create the project set up
Download Contract & JS Files from Repo
Configure your directory to reflect mine if you don’t want to change file locations in the actual code
Configure Truffle for Ganache
	Ensure your truffle-config.js & initial_migration align with your local set up 
truffle compile –all
	Running npm install may be helpful to install necessary libraries 
truffle migrate –reset
	truffle console will now allow you to interact with your contract 
	This console is Javascript
Run the outline test using:
	truffle exec test___.js *valid arguments* 


Generative AI Acknowledgment: Portions of the code in this project were generated with assistance from ChatGPT, an AI tool developed by OpenAI. 
Reference: OpenAI. (2024). ChatGPT [Large language model]. openai.com/chatgpt

