var Sale = artifacts.require("./Sale.sol");
var Token = artifacts.require("./Token.sol");

var account_one;
var account_two;
var account_three;

var saleAddress;
var tokenAddress;

var Tokenint;


contract('Token', function(accounts) {

  account_one = accounts[0];
  account_two = accounts[1];
  account_three = accounts[2];

  tokenAddress = Token.address;
  saleAddress = Sale.address;

  it("should confirm the Sale address", function() {
    return Token.deployed().then(function(instance) {
      Tokenint = instance;
      return instance.mintableAddress.call()
    }).then(function(address) {
      assert.equal(address, saleAddress, "Sale account is the same");
    });
  });


});



contract('Sale', function(accounts) {

  var cn;

  it("should setup the wallet", function() {
    return Sale.deployed().then(function(instance) {
      cn = instance;
      return instance.setup(tokenAddress, 50000, {from: account_one});
    });
  });

  it("should confirm the Token address", function() {
    return Sale.deployed().then(function(instance) {
      return instance.ETHWallet.call()
    }).then(function(address) {
      assert.equal(address, "0xf04d145dd24e05e6ac9149302b62970769795fba", "Transfer ETH to confirmed");
    });
  });


  it("should contribute some ETH", function() {
    return Sale.deployed().then(function(instance) {
      return instance.contribute({from: account_one, value: 20000000000})
    }).then(function(tx) {
      console.log(tx.logs.event);
      assert.equal(tx, "0xf04d145dd24e05e6ac9149302b62970769795fba", "Transfer ETH to confirmed");
    })
  });

});
