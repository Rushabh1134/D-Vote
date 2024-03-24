const { error } = require("console");
const her = require("hardhat");

async function main() {
  const Create = await her.ethers.getContractFactory("Create");
  const create = await Create.deploy();

  await create.waitForDeployment();

  console.log("Contract deployed to: ", create.target);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});