import { useState, useEffect } from "react";
import Web3 from "web3";
import { Biconomy } from "@biconomy/mexa";
import abi from "./abi.json";
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
  name: "p2p", //your dapp name as in your contract
  version: "1", //version as per your contract
  verifyingContract: "0x992C44EFE7d27D751BBe111379cd567A3BF002ff", //contract address
  salt: '0x' + (80001).toString(16).padStart(64, '0') //For mainnet replace 80001 with 137
}

let web3, walletWeb3;
function DApp(props) {
  const location = useLocation();
  const [amount, setAmount] = useState("");
  let [enter, setEnter] = useState(location.state.enter);
  const [transactionHash, setTransactionHash] = useState('');

  const [contract, setContract] = useState("");
  let nonce;
  useEffect(() => {
    if (!window.ethereum) {
      console.log("Metamask is required to use this DApp")
      return;
    }

    let maticProvider = new Web3.providers.HttpProvider("https://rpc-mumbai.matic.today"); //RPC URL as argument
    let biconomy = new Biconomy(maticProvider, { apiKey: "xBRmxgYBb.9dc7e261-5083-46fa-8def-e99433b65f55" });

    web3 = new Web3(biconomy);
    walletWeb3 = new Web3(window.ethereum);

    biconomy.onEvent(biconomy.READY, async () => {
      // Initialize your contracts here using biconomy's provider instance
      // Initialize dapp here like getting user accounts etc

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const newContract = new web3.eth.Contract(abi, "0x992C44EFE7d27D751BBe111379cd567A3BF002ff");
      setContract(newContract);


    }).onEvent(biconomy.ERROR, (error, message) => {
      // Handle error while initializing mexa

      console.log(error)
      console.log(message)
    });
  }, []);


  async function onButtonClickMeta() {

    nonce = await contract.methods.getNonce(window.ethereum.selectedAddress).call();

    let functionSignature = contract.methods.relaypaided(amount, enter[5]).encodeABI();

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

          const promiEvent = contract.methods
            .executeMetaTransaction(window.ethereum.selectedAddress, functionSignature, r, s, v)
            .send({
              from: window.ethereum.selectedAddress
            })
          promiEvent.on("transactionHash", (hash) => {
            console.log("Transaction sent successfully. Check console for Transaction hash")
            console.log("Transaction Hash is ", hash)
            setTransactionHash(hash)

          }).once("confirmation", (confirmationNumber, receipt) => {
            if (receipt.status) {
              console.log("Transaction processed successfully")
              alert("Transaction processed successfully");
              // GetAddress();
            } else {
              console.log("Transaction failed");
            }
            console.log(receipt)
          })
        } else {
          console.log("Could not get user signature. Check console for error")
        }
      }
    )
    //till here
  }


  return (
    <div >
      <div className='orders'>
        <br />
        <p>Order details</p>
        <div class="d-flex justify-content-center">
          <div className="p-2" style={{ width: '4%' }}>ID</div>
          <div className="p-2" style={{ width: '15%' }}>Price</div>
          <div className="p-2" style={{ width: '20%' }}>Limit/Available</div>
          <div className="p-2" style={{ width: '20%' }}>payment option</div>
        </div>
        <div class="d-flex justify-content-center">
          <div class="p-2" style={{ width: '4%', }}>{enter[5]}</div>
          <div class="p-2" style={{ width: '15%' }}> 1 Eth = {enter[3]}$</div>
          <div class="p-2" style={{ width: '20%' }}><p>Total Eth:{enter[2]}</p>
            <p>Limit:  {enter[1]} - {enter[2]}</p></div>
          <div class="p-2" style={{ width: '20%' }}>{enter[6]}</div>
        </div>
      </ div>
      <div className="DApp">
        <p>Transfers the Fait to seller Bank</p>

        <form>
          <label>
            <input type="uint256" name="amount" autoFocus={true}
              value={amount}
              onChange={(e) => setAmount(e.target.value)} placeholder='Enter amount' />
          </label>
        </form>
        <button type="button" className="button" onClick={onButtonClickMeta}>Paided</button>
        <br />
        <br />
        {transactionHash && <div><p>Transaction successfully</p>
          <p>Hash</p>
          <p>{transactionHash}</p></div>}

      </div>
    </div >
  );
}

export default DApp;
