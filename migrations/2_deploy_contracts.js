var chainOfCustody = artifacts.require("./chainOfCustody.sol");

module.exports = function(deployer) {
  deployer.deploy(chainOfCustody);
};
