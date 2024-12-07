const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const LIGHT_CLIENT_ADDRESS = "0x0000000000000000000000000000000000000001";
    const BRIDGE_ADDRESS = "0x0000000000000000000000000000000000000002";

    const CBTC = await ethers.getContractFactory("CBTC");
    const cBTC = await CBTC.deploy();
    await cBTC.deployed();
    console.log("cBTC deployed at:", cBTC.address);

    const PriceOracle = await ethers.getContractFactory("PriceOracle");
    const oracle = await PriceOracle.deploy();
    await oracle.deployed();
    console.log("Oracle deployed at:", oracle.address);
    await oracle.setPrice(cBTC.address, ethers.utils.parseEther("1"));

    const CGOV = await ethers.getContractFactory("CGOV");
    const cGOV = await CGOV.deploy();
    await cGOV.deployed();
    console.log("cGOV deployed at:", cGOV.address);

    const StableCoin = await ethers.getContractFactory("StableCoin");
    const stableCoin = await StableCoin.deploy(
        cBTC.address,
        ethers.BigNumber.from("1000000000000000000"),
        oracle.address,
        200
    );
    await stableCoin.deployed();
    console.log("cUSD deployed at:", stableCoin.address);

    const AMMDEX = await ethers.getContractFactory("AMMDEX");
    const dex = await AMMDEX.deploy(
        cBTC.address,
        stableCoin.address,
        LIGHT_CLIENT_ADDRESS,
        BRIDGE_ADDRESS,
        oracle.address,
        cGOV.address,
        30,
        10,
        deployer.address
    );
    await dex.deployed();
    console.log("DEX deployed at:", dex.address);

    await cBTC.transferOwnership(dex.address);
    console.log("Transferred cBTC ownership to DEX");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
