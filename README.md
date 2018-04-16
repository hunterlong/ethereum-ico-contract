# Ethereum ICO Crowdsale Contract  [![Build Status](https://travis-ci.org/hunterlong/ethereum-ico-contract.svg?branch=master)](https://travis-ci.org/hunterlong/ethereum-ico-contract)

This is a basic example of a crowdsale with a brand new ERC20 token. First deploy the Sale contract, and then the ERC20 token contract. The ERC20 contract will require the Sale Contract etheruem address.

## Contract Details
- Creates/Mints 5 million Tokens and holds them inside contract.
- ERC20 and Sale Contract both reference eachother
- Converts payable ETH to TOKEN's directly to user
- ETH payed to contract is forwarded to a different wallet (holds ICO funds)
- Updateable ETH/TOKEN rate
- Developers and Founders can allocate a specific amount of tokens to be released at later date.
- Ability to turn on/off transfer of coins. (via sale contract)
- Crowdsale ends on a specific block number
- Token contrbutions will be removed from the Mint and transfered to the purchaser.
- Users that have tokens held can release them once time has passed without owner permission. 

# Deploy Instructions

1. You must deploy the Sale contract first. **Be sure to change the token sale details in contract**. Include a wallet address for ETH to be sent to for each contribution. Example: `Sale("0x004F3E7fFA2F06EA78e14ED2B13E87d710e8013F")` creating contract [0x2b15ebaab98a5af6b0e3e9baef3580b9a387ffed](https://ropsten.etherscan.io/address/0x2b15ebaab98a5af6b0e3e9baef3580b9a387ffed)

2. Once you have the Sale contract, deploy the Token contract. **Be sure to change the token details** and `createTokens` intial minted amount. When you deploy the Token contract, you must include the Sale contract address when you deploy the contract. Example: `Token("0x2b15ebaab98a5af6b0e3e9baef3580b9a387ffed")` creating token contract [0x501775ea69e834c2cdc0be13ab25704d92168101](https://ropsten.etherscan.io/token/0x501775ea69e834c2cdc0be13ab25704d92168101)

3. Now you can finalize the process by running the `setup` function to the Sale contract. The setup function requires the token contract address and then ending block number of when the ICO should end. The owner of the contract can also end at any time. Example: `setup("0x501775ea69e834c2cdc0be13ab25704d92168101", 7000000)` creating transaction [0x682392db4d184fc5e96c7dbf53b29c891d7158422ecd7935b484159ed633ca79](https://ropsten.etherscan.io/tx/0x682392db4d184fc5e96c7dbf53b29c891d7158422ecd7935b484159ed633ca79) My ICO sale will end and expire on block #7000000.

4. **Your ICO has begun!** You can now send ETH to the Sale contract address to receive your new tokens! I sent 1 ETH with data: `0xd7bb99ba` to my Sale contract address. The user must send ETH or the transaction will fail! Example: 1 ETH - Data: `0xd7bb99ba` - Gas Limit: `80000` creating transaction [0xbf541f8b39d5b94670c909e85cec8035b7c30d178d2c6e5637e1ad395ca2d9b2](https://ropsten.etherscan.io/tx/0xbf541f8b39d5b94670c909e85cec8035b7c30d178d2c6e5637e1ad395ca2d9b2) This transaction sent 1 ETH to the ETH wallet address and also sent me 600 Tokens. 

5. Once you received your $15 million for the ICO you can close it at anytime with the `closeSale` function. Example: `closeSale()` creating transaction [0xae7608515185bfeb3aa185890edb733bc5c0031f392ece5366179463bd27e430](https://ropsten.etherscan.io/tx/0xae7608515185bfeb3aa185890edb733bc5c0031f392ece5366179463bd27e430). The ICO Sale is over!

This ICO-sale contract will allow you to change owners, change token rate per ETH, hold tokens for a specific amount of time, and allow users that have tokens held. The Sale contract locks the tokens, once the set block height has been passed, the user can run `realeaseHeldCoins()` (`0x6ce5b3cf`) to the sale contract to receive their tokens if the time has passed! Example: [0xf1856d866db8a022b847960b5caa55170640714dbd14e981625d6cf373973885](https://ropsten.etherscan.io/tx/0xf1856d866db8a022b847960b5caa55170640714dbd14e981625d6cf373973885)

### Crowdsale Contract
`function contribute() external payable` is the function for the purchaser to mint new tokens. (Data: `0xd7bb99ba`)

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

Once a time period as passed, the wallet owner can do a contract call to receive the tokens. (Data: `0x6ce5b3cf`)
```
function releaseHeldCoins()
```
