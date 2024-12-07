require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy");

module.exports = {
    solidity: "0.8.18",
    networks: {
        citrea: {
            url: "https://rpc.citrea.network",
            accounts: ["0xYourPrivateKey"] // Replace with your private key
        },
    },
};
