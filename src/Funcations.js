import { ethers } from "ethers";
import abi from "./abi.json";
import Web3 from "web3";

export const getledger = async (provider) => {

    try {
        const contract = new ethers.Contract("0x85E4af9653C6af4534F2CccD2d9f50B2Efb740f7", abi, provider);
        let ledger = await contract.getledger();
        if (ledger !== undefined) {
            ledger.forEach(element => {
                console.log(element);
            })
        }
        localStorage.setItem('ledger', JSON.stringify(ledger));
        return ledger;
    } catch (err) {
        console.error(err);

    }
};

export const selleth = async (low, high, active, price, singer, addEtherAmountWei) => {
    const contract = new ethers.Contract("0x85E4af9653C6af4534F2CccD2d9f50B2Efb740f7", abi, singer);
    let order = await contract.createOrder(low, high, active, price, {
        value: addEtherAmountWei,
    });

};