# Ethereum ICO Crowdsale Contract  [![Build Status](https://travis-ci.org/hunterlong/ethereum-ico-contract.svg?branch=master)](https://travis-ci.org/hunterlong/ethereum-ico-contract)

This is a basic example of a crowdsale with a brand new ERC20 token. First deploy the Sale contract, and then the ERC20 token contract. The ERC20 contract will require the Sale Contract etheruem address.

## Contract Details
- Creates/Mints 5 million Tokens and holds them inside contract.
- ERC20 and Sale Contract both reference eachother
- Converts payable ETH to TOKEN's directly to user
- ETH payed to contract is forwarded to a different wallet
- Updateable ETH/TOKEN rate
- Developers and Founders can allocate a specific amount of tokens to be released at later date.
- Ability to turn on/off transfer of coins. (via sale contract)
- Crowdsale ends on a specific block number
- Token contrbutions will be removed from the Mint and transfered to the purchaser.

After you deploy the Sale Contract and deployed the Token contract you can finish the setup process by executing the `setup` fnction. Insert the ERC20 Token contract address and the crowdsale END BLOCK number, the crowdsale will end on this block.
`function setup(address TOKEN, uint endBlockTime);`

### Crowdsale Contract
`function contribute() external payable` is the function for the purchaser to mint new tokens. 

### ERC20 Additions
The ERC20 contract has a couple additions to be reviewed by you. When the token contract is deployed, it will require the Sale Contract address and will be set 1 and only 1 time. If you set an incorrect address when you deploy the ERC20 you'll have to re-deploy the sale and ERC20 again. This is for security, 1 time set functions.

#### Minting Tokens
Minting Tokens call comes from the Sale contract, when the ERC20 is deployed it will force the Sale contract.
`function mintToken(address to, uint256 amount) external returns (bool success);`

Change "transfer" method from the Sale Contract. 
`function changeTransfer(bool allowed);`

### Hold Token Period

The Sale Contract will allow you to hold a specific amount of tokens for an amount of time before being released directly to address. The createHoldToken function requires an address and the amount of tokens given at end of period.
```
function createHeldCoins() internal {
  createHoldToken(0x4f70Dc5Da5aCf5e71988c3a8473a6D8a7E7Ba4c9, 100000000000000000000000); // 100,000
  createHoldToken(0x323c82c7Ae55B48745f4eCcd2523450d291f2412, 250000000000000000000000); // 250,000
}
```

You can change the amount of blocks in future to release.
```
function createHoldToken(address _to, uint256 amount) internal {
...
  heldTimeline[_to] = block.number + 200000;
...
}
```


Once a time period as passed, the wallet owner can do a contract call to receive the tokens.
```
function releaseHeldCoins()
```

```

