const { task, types } = require("hardhat/config")
const ethers = require("ethers")
const util = require("util")
const request = util.promisify(require("request"))
const DEPLOYER_PRIVATE_KEY = "032c6bdae6cc5408b0362b1eac35bf2f373bda66f005d15fa20bdc412e41b1c8"

const poseidonContract = require("circomlibjs/src/poseidon_gencontract.js")

task("deploy:verifier", "Deploy a Verifier contract")
    .addOptionalParam("merkletreedepth", "Merkle tree depth", 20, types.int)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ merkletreedepth, logs }, { ethers }) => {

        console.log("===== Deploying Verifier Contract =====")

        const priorityFee = await callRpc("eth_maxPriorityFeePerGas")

        async function callRpc(method, params) {
            var options = {
              method: "POST",
              url: "https://api.hyperspace.node.glif.io/rpc/v1",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                jsonrpc: "2.0",
                method: method,
                params: params,
                id: 1,
              }),
            };
            const res = await request(options);
            return JSON.parse(res.body).result;
        }

        const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY)
        const chainId = network.config.chainId

        const VerifierContractFactory = await ethers.getContractFactory(`Verifier${merkletreedepth}`)
        const verifierContract = await VerifierContractFactory.deploy({
            gasLimit: 1000000000,
            maxPriorityFeePerGas: priorityFee
        })
        await verifierContract.deployed()

        if (logs) {
            console.info(`Verifier${merkletreedepth} contract has been deployed to: ${verifierContract.address}`)
        }

        return verifierContract
    })

task("deploy:credential", "Deploy a CredsProtocolOpenIssuer contract")
    .addOptionalParam("verifiers", "Tree depths and verifier addresses", [], types.json)
    .addOptionalParam("admin", "Admin address", [], types.string)
    .addOptionalParam("issuerName", "Issuer Name", [], types.string)
    .addOptionalParam("issuerSymbol", "Issuer Symbol", [], types.string)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, verifiers, admin, issuerName, issuerSymbol  }, { ethers }) => {

        const priorityFee = await callRpc("eth_maxPriorityFeePerGas")

        async function callRpc(method, params) {
            var options = {
              method: "POST",
              url: "https://api.hyperspace.node.glif.io/rpc/v1",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                jsonrpc: "2.0",
                method: method,
                params: params,
                id: 1,
              }),
            };
            const res = await request(options);
            return JSON.parse(res.body).result;
        }

        const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY)
        const chainId = network.config.chainId

        const poseidonABI = poseidonContract.generateABI(2)
        const poseidonBytecode = poseidonContract.createCode(2)

        const [signer] = await ethers.getSigners()

        console.log("===== Deploying Poseidon Library =====")

        const PoseidonLibFactory = new ethers.ContractFactory(poseidonABI, poseidonBytecode, signer)
        const poseidonLib = await PoseidonLibFactory.deploy({
            gasLimit: 1000000000,
            maxPriorityFeePerGas: priorityFee
        })

        await poseidonLib.deployed()

        if (logs) {
            console.info(`Poseidon library has been deployed to: ${poseidonLib.address}`)
        }

        console.log("===== Deploying IncrementalBinaryTree Library =====")

        const IncrementalBinaryTreeLibFactory = await ethers.getContractFactory("IncrementalBinaryTree", {
            libraries: {
                PoseidonT3: poseidonLib.address
            }
        })
        const incrementalBinaryTreeLib = await IncrementalBinaryTreeLibFactory.deploy({
            gasLimit: 1000000000,
            maxPriorityFeePerGas: priorityFee
        })

        await incrementalBinaryTreeLib.deployed()

        if (logs) {
            console.info(`IncrementalBinaryTree library has been deployed to: ${incrementalBinaryTreeLib.address}`)
        }

        console.log("===== Deploying Credential Contract =====")

        const SemaphoreContractFactory = await ethers.getContractFactory("CredsProtocolOpenIssuer", {
            libraries: {
                IncrementalBinaryTree: incrementalBinaryTreeLib.address
            }
        })

        const semaphoreContract = await SemaphoreContractFactory.deploy(verifiers, admin, issuerName, issuerSymbol, {
            gasLimit: 1000000000,
            maxPriorityFeePerGas: priorityFee
        })

        await semaphoreContract.deployed()

        if (logs) {
            console.info(`CredsProtocolOpenIssuer contract has been deployed to: ${semaphoreContract.address}`)
        }

        
        return semaphoreContract
    })

task("deploy", "Deploy")
    .addOptionalParam("credential", "CredsProtocolOpenIssuer contract address", undefined, types.string)
    .addOptionalParam("group", "Group identifier", 1, types.int)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, credential: credentialAddress, group: groupId }, { ethers, run }) => {

        console.log("===== Deploying Creds Protocol =====")
        const priorityFee = await callRpc("eth_maxPriorityFeePerGas")

        async function callRpc(method, params) {
            var options = {
              method: "POST",
              url: "https://api.hyperspace.node.glif.io/rpc/v1",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                jsonrpc: "2.0",
                method: method,
                params: params,
                id: 1,
              }),
            };
            const res = await request(options);
            return JSON.parse(res.body).result;
        }

        const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY)
        console.log("Wallet Ethereum Address:", deployer.address)
        const chainId = network.config.chainId
        
        var admin = deployer.address
        var issuerName = "Creds Protocol Open Issuer"
        var issuerSymbol = "CPOI"

        if (!credentialAddress) {
            const { address: verifierAddress } = await run("deploy:verifier", { logs, merkletreedepth: 20 })
            console.log(verifierAddress)
            const { address } = await run("deploy:credential", {
                logs,
                verifiers: [
                    [
                        verifierAddress, 20
                    ]
                ],
                admin,
                issuerName,
                issuerSymbol
            })

            credentialAddress = address
        }

    })


    