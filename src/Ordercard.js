import React from 'react';
import { useEffect, useState } from "react";
import { parse } from 'path';
import axios from "axios";
import web3 from 'web3';
import './App.css';
import { Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Ordercard = ({ enter1 }) => {
    let arrayenter = []
    const navigate = useNavigate();
    const clickHandler = () => {
        arrayenter.push(enter1[0]);
        arrayenter.push(web3.utils.hexToNumber(enter1[2].hex))
        arrayenter.push(web3.utils.hexToNumber(enter1[3].hex))
        arrayenter.push(web3.utils.hexToNumber(enter1[4].hex))
        arrayenter.push(enter1[5])
        arrayenter.push(web3.utils.hexToNumber(enter1[6].hex))
        arrayenter.push(enter1[7])
        arrayenter.push(web3.utils.hexToNumber(enter1[8].hex))

        navigate(`/orders/id`, { state: { enter: arrayenter, } });
    };


    return (
        <div>

            {(enter1.length > 0) ? (
                <div className='orders'>
                    <div class="d-flex justify-content-center">
                        <div class="p-2" style={{ width: '4%', }}>{web3.utils.hexToNumber(enter1[6].hex)}</div>
                        <div class="p-2" style={{ width: '15%' }}> 1 Eth = {web3.utils.hexToNumber(enter1[4].hex)}$</div>
                        <div class="p-2" style={{ width: '20%' }}><p>Total Eth:{web3.utils.hexToNumber(enter1[3].hex)}</p>
                            <p>Limit:  {web3.utils.hexToNumber(enter1[1].hex)} - {web3.utils.hexToNumber(enter1[2].hex)}</p></div>
                        <div class="p-2" style={{ width: '20%' }}>{enter1[7]}</div>
                        <div class="p-2" style={{ width: '3%' }}><button className="btn btn-outline-info" onClick={clickHandler}>Buy</button></div>
                    </div>

                </div>

            ) :
                (<div></div>)
            }

        </div>);
};

export default Ordercard;