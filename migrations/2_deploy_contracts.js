var Token = artifacts.require("./Token.sol");
var Sale = artifacts.require("./Sale.sol");

module.exports = function(deployer) {
	deployer.deploy(Sale, "0x004F3E7fFA2F06EA78e14ED2B13E87d710e8013F").then(function() {
		return deployer.deploy(Token, Sale.address);
	});
};
