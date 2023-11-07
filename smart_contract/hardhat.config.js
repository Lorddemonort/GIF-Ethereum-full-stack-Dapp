require("@nomicfoundation/hardhat-toolbox");

// Alchemy Keys:
// API key: 5Q3C85kzcgyYEUkRfDn_kX_za9ZE5BQ1
// https: https://eth-goerli.g.alchemy.com/v2/5Q3C85kzcgyYEUkRfDn_kX_za9ZE5BQ1
// WEbsocket: wss://eth-goerli.g.alchemy.com/v2/5Q3C85kzcgyYEUkRfDn_kX_za9ZE5BQ1

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/5Q3C85kzcgyYEUkRfDn_kX_za9ZE5BQ1',
      accounts: ['e2e170df6f42d543a2927499dee05c1ea6f515beef1854621b13a75faf9f04e8']
    }
  }
}