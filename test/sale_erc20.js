var Sale = artifacts.require("./Sale.sol");
var Token = artifacts.require("./Token.sol");

var account_one;
var account_two;
var account_three;

var saleAddress;
var tokenAddress;

var Tokenint;


contract('Sale', function(accounts) {

  account_one = accounts[0];
  account_two = accounts[1];
  account_three = accounts[2];

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
      assert.equal(address, "0x004f3e7ffa2f06ea78e14ed2b13e87d710e8013f", "Transfer ETH to confirmed");
    });
  });


  it("should contribute some ETH", function() {
    return Sale.deployed().then(function(instance) {
      return instance.contribute({from: account_one, value: 20000000000})
    }).then(function(tx) {
      assert.equal(tx.logs[0].event, "Contribution", "Transfer ETH to confirmed");
    })
  });


  it("should send some ETH without contribute function", function() {
      return Sale.deployed().then(function(instance) {
          return instance.sendTransaction({value: 100000000000, gasLimit: 100000, from: account_three});
      }).then(function(tx) {
          assert.equal(tx.logs[0].event, "Contribution", "Transfer ETH to confirmed");
      })
  });


  it("should have TOKENs in wallet 1", function() {
    return Token.deployed().then(function(instance) {
      Tokenint = instance;
      return instance.balanceOf.call(account_one)
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 12000000000000, "Purchaser has the new Tokens");
    })
  });

  it("should have TOKENs in wallet 3", function() {
      return Token.deployed().then(function(instance) {
          Tokenint = instance;
          return instance.balanceOf.call(account_three)
      }).then(function(balance) {
          assert.equal(balance.valueOf(), 60000000000000, "Purchaser has the new Tokens");
      })
  });

  it("should transfer Tokens to someone else", function() {
    return Token.deployed().then(function(instance) {
      return instance.transfer(account_two, 100000000, {from: account_one})
    }).then(function(tx) {
      assert.equal(tx.logs[0].event, "Transfer", "Transfer Tokens confirmed");
    })
  });


  it("second address has TOKENs in wallet", function() {
    return Token.deployed().then(function(instance) {
      return instance.balanceOf.call(account_two)
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 100000000, "Second wallet has some Tokens");
    })
  });

  it("should change TOKEN/ETH rate", function() {
    return Sale.deployed().then(function(instance) {
      return instance.updateRate(750, {from: account_one})
    }).then(function() {
      return cn.exchangeRate.call()
    }).then(function(rate) {
      assert.equal(rate, 750, "Rate was changed");
    })
  });


  it("should change creator", function() {
    return Sale.deployed().then(function(instance) {
      cn = instance;
      return instance.changeCreator(account_two, {from: account_one})
    }).then(function() {
      return cn.creator.call()
    }).then(function(creator) {
      assert.equal(creator.valueOf(), account_two, "Creator was changed");
    })
  });


  it("should change Transfer status to OFF", function() {
    return Sale.deployed().then(function(instance) {
      return instance.changeTransferStats(false, {from: account_two})
    }).then(function() {
      return Tokenint.allowTransfer.call()
    }).then(function(allow) {
      assert.equal(allow, false, "Tokens cannot be transferred");
    })
  });


  it("should change Transfer status to ON", function() {
    return Sale.deployed().then(function(instance) {
      return instance.changeTransferStats(true, {from: account_two})
    }).then(function() {
      return Tokenint.allowTransfer.call()
    }).then(function(allow) {
      assert.equal(allow, true, "Tokens can be transferred");
    })
  });


  it("should turn off token sale", function() {
    return Sale.deployed().then(function(instance) {
      return instance.closeSale({from: account_two})
    }).then(function() {
      return cn.isFunding.call()
    }).then(function(allow) {
      assert.equal(allow, false, "Tokens Sale has ended");
    })
  });


  it("should return amount of tokens to be held", function() {
      return Sale.deployed().then(function(instance) {
          return instance.getHeldCoin(account_one)
      }).then(function(held) {
          assert.equal(held.valueOf(), 1000, "Tokens that are held for address");
      })
  });


  it("should release held tokens to founders", function() {
    return Sale.deployed().then(function(instance) {
      return instance.releaseHeldCoins({from: account_one})
    }).then(function() {
      return Tokenint.balanceOf.call(account_one)
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 11999900001000, "Tokens were released to founder");
    })
  });

});


contract('Token', function(accounts) {

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
