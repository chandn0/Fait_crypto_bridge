import React from 'react';
import './App.css';
import { Link } from "react-router-dom";
import Orders from './Orders';


const Home = () => {



    return (
        <div>


            {/* <div className='logo'>hihii</div> */}
            {/* <div className='connectwallet'><button>co</button></div> */}
            <div className='title'>Decentralized p2p protocol that allows users to move between fiat and crypto with out need to trust  any third party. </div>
            <div className='paragraph'>Get a seamless, secure and free expereince buying crypto with fiat.</div>
            <div className='lanchApp'><Link to="/orders"><button type="button" className="btn btn-outline-info">Lanch App</button></Link></div>
            <div className='working'>
                <h3 style={{ textAlign: 'center', }}>Working process</h3>
                <br />
                <p>
                    1️⃣ Crypto seller transfers the token to the smart , along with the fiat payment option details (bank account details)<br /><br />
                    2️⃣ Any user, who wants to buy the crypto, will select a seller, and  Transfers the fiat to the seller bank.Submits the proof to seller on chain<br /><br />
                    3️⃣ The seller verifies whether the buyer send the fiat or not<br /><br />
                    4️⃣ If the seller verifies that he has received fiat, the crypto is transfered to the user account <br /><br />
                    {/* 5️⃣ If it is found that the  seller is lying then, his remaining crypto is locked in protocol.<br /><br /> */}
                </p>
            </div>

        </div>
    );
};

export default Home;