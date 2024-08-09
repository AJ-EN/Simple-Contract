const ethers = require("ethers")
// const solc = require("solc")
const fs = require("fs")
require("dotenv").config()

async function main() {

    // Replace with your local node's RPC URL
    let provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)

    // Replace with your wallet private key
    let wallet = new ethers.Wallet(process.env.PRIVATE_KEYS, provider);

    // Read ABI and bytecode from files
    const abi = fs.readFileSync("./simpleStorage_sol_SimpleStorage.abi", "utf8");
    const binary = fs.readFileSync("./simpleStorage_sol_SimpleStorage.bin", "utf8");

    // Create contract factory
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")
    const contract = await contractFactory.deploy()
    // await contract.waitForDeployment(); // Wait for contract deployment
    await contract.deployTransaction.wait(1);

    // const nonce = await wallet.getTransactionCount();
    // const tx = {
    //     nonce: nonce,
    //     gasPrice: "20000000000",
    //     gasLimit: 6721975,
    //     to: null,
    //     value: 0,
    //     networkId: 5777,
    // };
    // const sentTxResponse = await wallet.sendTransaction(tx);
    // await sentTxResponse.wait(1);
    // console.log(sentTxResponse);

    let currentFavoriteNumber = await contract.retrieve();
    console.log(`Current Favorite Number: ${currentFavoriteNumber}`);
    let transactionResponse = await contract.store(7);
    let transactionReceipt = await transactionResponse.wait();
    currentFavoriteNumber = await contract.retrieve()
    console.log(`New Favorite Number: ${currentFavoriteNumber}`)
    console.log(`contract Address: ${contract.address}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
