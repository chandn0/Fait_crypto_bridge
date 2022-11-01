import React, { useState, useEffect } from "react";
// import "../App.css";
import {
    NotificationContainer,
    NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";


import { ethers } from "ethers";
let sigUtil = require("eth-sig-util");

let config = {
    contract: {
        address: "0xc9736AC25058493341B2C57f1f69180A23cad299",
        abi: [
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "name_",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "symbol_",
                        "type": "string"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "subtractedValue",
                        "type": "uint256"
                    }
                ],
                "name": "decreaseAllowance",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "userAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "functionSignature",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "sigR",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "sigS",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint8",
                        "name": "sigV",
                        "type": "uint8"
                    }
                ],
                "name": "executeMetaTransaction",
                "outputs": [
                    {
                        "internalType": "bytes",
                        "name": "",
                        "type": "bytes"
                    }
                ],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "addedValue",
                        "type": "uint256"
                    }
                ],
                "name": "increaseAllowance",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "userAddress",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "relayerAddress",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "bytes",
                        "name": "functionSignature",
                        "type": "bytes"
                    }
                ],
                "name": "MetaTransactionExecuted",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                        "internalType": "uint8",
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    }
                ],
                "name": "getNonce",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "nonce",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
    },
}

//this changes for all EIP712Sign variations of custom approach 
const domainType = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "verifyingContract", type: "address" },
    { name: "salt", type: "bytes32" },
];

const metaTransactionType = [
    { name: "nonce", type: "uint256" },
    { name: "from", type: "address" },
    { name: "functionSignature", type: "bytes" }
];

let domainData = {
    name: "ER20",
    version: "1",
    verifyingContract: config.contract.address,
    // salt: ethers.utils.hexZeroPad((ethers.BigNumber.from(42)).toHexString(), 32)
    salt: '0x' + (80001).toString(16).padStart(64, '0') //For mainnet replace 80001 with 137

};

let walletProvider;
let contractInterface;

function Custommeta() {
    contractInterface = new ethers.utils.Interface(config.contract.abi);

    const getSignatureParameters = signature => {
        console.log(signature);
        if (!ethers.utils.isHexString(signature)) {
            throw new Error(
                'Given value "'.concat(signature, '" is not a valid hex string.')
            );
        }
        var r = signature.slice(0, 66);
        var s = "0x".concat(signature.slice(66, 130));
        var v = "0x".concat(signature.slice(130, 132));
        v = ethers.BigNumber.from(v).toNumber();
        if (![27, 28].includes(v)) v += 27;
        return {
            r: r,
            s: s,
            v: v
        };
    };

    const onSubmitWithEIP712Sign = async event => {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        contractInterface = new ethers.utils.Interface(config.contract.abi);

        let contract = new ethers.Contract(config.contract.address, config.contract.abi, signer)

        const accounts = await provider.send("eth_requestAccounts", []);

        let userAddress = accounts[0];
        console.log(userAddress);
        let nonce = await contract.getNonce(userAddress);
        console.log(nonce);
        let functionSignature = contractInterface.encodeFunctionData("transfer", ["0x049E7972B887647232519014E81a40aB61BE5500", 10]);
        let message = {};
        message.nonce = parseInt(nonce);
        console.log(nonce);
        message.from = userAddress;
        message.functionSignature = functionSignature;

        const dataToSign = JSON.stringify({
            types: {
                EIP712Domain: domainType,
                MetaTransaction: metaTransactionType
            },
            domain: domainData,
            primaryType: "MetaTransaction",
            message: message
        });

        // Its important to use eth_signTypedData_v3 and not v4 to get EIP712 signature because we have used salt in domain data
        // instead of chainId
        walletProvider = new ethers.providers.Web3Provider(window.ethereum);
        let signature = await walletProvider.send("eth_signTypedData_v3", [userAddress, dataToSign])
        let { r, s, v } = getSignatureParameters(signature);
        console.log("end");

        // let tx = await contract.executeMetaTransaction(userAddress, functionSignature, r, s, v);
        // console.log(tx);


        let privateKey = "a26a8ee4f4670bb27e706f81a2c2c5395afe3547810dbc205f7117b0b43715c8";                 //signing with our private key
        let wallet = new ethers.Wallet(privateKey, provider);
        let ccontract = new ethers.Contract(config.contract.address, config.contract.abi, wallet)
        let tx = await ccontract.executeMetaTransaction(userAddress, functionSignature, r, s, v);


        // let rawTx, tx;
        // rawTx = {
        //     to: config.contract.address,
        //     data: contractInterface.encodeFunctionData(
        //         "executeMetaTransaction",
        //         [userAddress, functionSignature, r, s, v]
        //     ),
        //     from: userAddress,
        //     chainId: 137,
        // };
        // tx = await wallet.signTransaction(rawTx);
        // console.log(rawTx);
        // // let transactionHash;
        // // let providerp = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/");

        // let receipt = await provider.sendTransaction(tx);
    };

    return (
        <div className="App">

            <section>
                <div className="submit-container">
                    <div className="submit-row">


                        <button variant="contained" color="secondary" onClick={onSubmitWithEIP712Sign} style={{ marginLeft: "10px" }}>
                            Submit (Private Key)
                        </button>
                    </div>
                </div>
            </section>

            <NotificationContainer />
        </div>
    );
}

export default Custommeta;