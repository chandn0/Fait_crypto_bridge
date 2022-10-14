import React from 'react';
import Home from './Home';
import { Routes, Route } from "react-router-dom";
import Orders from './Orders';
import './App.css';
import DApp from './DApp';


function App() {


    return (
        <div className='App'>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Home />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/id" element={<DApp />} />
            </Routes>
        </div>
    );
};

export default App;