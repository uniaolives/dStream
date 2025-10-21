async function main() {
  const EmoteRegistry = await ethers.getContractFactory("EmoteRegistry1155");

  // Start deployment, returning a promise that resolves to a contract object
  const emoteRegistry = await EmoteRegistry.deploy();
  console.log("Contract deployed to address:", emoteRegistry.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
