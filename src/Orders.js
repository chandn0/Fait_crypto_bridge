import React, { useEffect } from 'react';
import './App.css';
import { ethers } from "ethers";
import Ordercard from './Ordercard';
import abi from "./abi.json";
import Web3 from "web3";
import { useState } from 'react';

const Orders = () => {
    const [publicKey, setPublickey] = useState();
    const [network, setNetwork] = useState();
    const [chainId, setChainId] = useState();
    const [msg, setMsg] = useState();
    const connectButton = async () => {
        const { ethereum } = window;
        if (ethereum.isMetaMask) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);

            const { name, chainId } = await provider.getNetwork();

            setNetwork(name);
            setChainId(chainId);
            setPublickey(accounts[0]);
        } else {
            setMsg("Install MetaMask");
        }
    };

    let maticProvider = new Web3.providers.HttpProvider("https://rpc-mumbai.matic.today");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    async function getl() {
        try {
            const contract = new ethers.Contract("0x992C44EFE7d27D751BBe111379cd567A3BF002ff", abi, provider);
            let ledger = await contract.getledger();

            localStorage.setItem('ledger', JSON.stringify(ledger));

        } catch (err) {
            console.error(err);

        }
    }
    useEffect(() => {

        getl();
    }, []);


    return (
        <div>
            <div className='connectwallet'>
                {!publicKey ? (<button className="btn btn-outline-info" onClick={connectButton}>connectwallet</button>) : (
                    <div>
                        <p><button className="btn btn-outline-info" >{publicKey.substring(0, 9)}</button></p>
                    </div>
                )

                }</div>

            <div className='orders'>
                <h3>Buy Eth</h3>
                <br />
                <div class="d-flex justify-content-center">
                    <div className="p-2" style={{ width: '4%' }}>ID</div>
                    <div className="p-2" style={{ width: '15%' }}>Price</div>
                    <div className="p-2" style={{ width: '20%' }}>Limit/Available</div>
                    <div className="p-2" style={{ width: '20%' }}>payment option</div>
                    <div className="p-2" style={{ width: '3%' }}>trade</div>
                </div>
                <hr />

            </div>
            {JSON.parse(localStorage.getItem('ledger')) &&
                JSON.parse(localStorage.getItem('ledger')).map((enter, i) => {
                    return (
                        <Ordercard key={i}
                            enter1={enter} />
                    );
                }
                )}
        </div>
    );
};

export default Orders;