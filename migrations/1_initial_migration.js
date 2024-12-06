const chainOfCustody = artifacts.require("./Migrations.sol");

module.exports = async function (deployer, network, accounts) {
  // Access web3 instance provided by Truffle
  await deployer.deploy(chainOfCustody);
};