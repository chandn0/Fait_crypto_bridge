import { useState, useEffect } from "react";
import Web3 from "web3";
import { Biconomy } from "@biconomy/mexa";
import abi from "./abi1.json";
import { useLocation, useParams } from "react-router-dom";


//Initialize Constants
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
    name: "SaveAddress", //your dapp name as in your contract
    version: "1", //version as per your contract
    verifyingContract: "0x031D637Cb3b40429D8fCb34165fA43BFD2EA7950", //contract address
    salt: '0x' + (80001).toString(16).padStart(64, '0') //For mainnet replace 80001 with 137

}

let web3, walletWeb3;
function Permethod(props) {
    // let web3 = Web3;
    const location = useLocation();
    const [amount, setAmount] = useState("");
    // let [enter, setEnter] = useState(location.state.enter);
    const [transactionHash, setTransactionHash] = useState('');

    const [contract, setContract] = useState("");
    let nonce;
    walletWeb3 = new Web3(window.ethereum);


    async function onButtonClickMeta() {
        const newContract = new walletWeb3.eth.Contract(abi, "0x031D637Cb3b40429D8fCb34165fA43BFD2EA7950");
        setContract(newContract);

        nonce = await contract.methods.getNonce(window.ethereum.selectedAddress).call();

        let functionSignature = contract.methods.saveAddress("fun").encodeABI();

        let message = {};
        message.nonce = parseInt(nonce);
        message.from = window.ethereum.selectedAddress;
        message.functionSignature = functionSignature;

        //copy from this point on

        const dataToSign = JSON.stringify({
            types: {
                EIP712Domain: domainType,
                MetaTransaction: metaTransactionType
            },
            domain: domainData,
            primaryType: "MetaTransaction",
            message: message
        });

        walletWeb3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            id: 999999999999,
            method: "eth_signTypedData_v4",
            params: [window.ethereum.selectedAddress, dataToSign]
        },
            async function (err, result) {
                if (err) {
                    return console.error(err);
                }
                console.log("Signature result from wallet :")
                console.log(result);
                if (result && result.result) {
                    const signature = result.result.substring(2);
                    const r = "0x" + signature.substring(0, 64);
                    const s = "0x" + signature.substring(64, 128);
                    const v = parseInt(signature.substring(128, 130), 16);
                    console.log(r, "r")
                    console.log(s, "s")
                    console.log(v, "v")

                    console.log(window.ethereum.selectedAddress, "userAddress")



                    const newContrac = new walletWeb3.eth.Contract(abi, "0x031D637Cb3b40429D8fCb34165fA43BFD2EA7950");

                    const promiEvent = newContrac.methods.executeMetaTransaction(window.ethereum.selectedAddress, functionSignature, r, s, v).send({
                        from: window.ethereum.selectedAddress
                    })
                    // promiEvent.on("transactionHash", (hash) => {
                    //     console.log("Transaction sent successfully. Check console for Transaction hash")
                    //     console.log("Transaction Hash is ", hash)
                    //     setTransactionHash(hash)

                    // }).once("confirmation", (confirmationNumber, receipt) => {
                    //     if (receipt.status) {
                    //         console.log("Transaction processed successfully")
                    //         alert("Transaction processed successfully");
                    //         // GetAddress();
                    //     } else {
                    //         console.log("Transaction failed");
                    //     }
                    //     console.log(receipt)
                    // })
                } else {
                    console.log("Could not get user signature. Check console for error")
                }
            }
        )
        //till here
    }


    return (
        <div >
            <button onClick={onButtonClickMeta}> button</button>
        </div >
    );
}

export default Permethod;
