var Token = artifacts.require("./Token.sol");
var Sale = artifacts.require("./Sale.sol");

module.exports = function(deployer) {
	deployer.deploy(Sale).then(function() {
		return deployer.deploy(Token, Sale.address);
	});
};
