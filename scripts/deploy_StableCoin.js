const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying StableCoin with account:", deployer.address);

    const cBTCAddress = "0xYourCBTCAddress"; // Put your cBTC address here
    const oracleAddress = "0xYourOracleAddress"; // Put your oracle address here

    const StableCoin = await ethers.getContractFactory("StableCoin");
    const stableCoin = await StableCoin.deploy(
        cBTCAddress,
        ethers.BigNumber.from("1000000000000000000"), // 1:1 ratio
        oracleAddress,
        200 // stability fee bps
    );
    await stableCoin.deployed();
    console.log("StableCoin deployed at:", stableCoin.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
