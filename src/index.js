import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import GlobalStore from "./globalStore/globalStore";
import {BrowserRouter} from "react-router-dom";

const globalStore = new GlobalStore();

export const Context = createContext({
    globalStore
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Context.Provider value={{
            globalStore
        }}>
            <App />
        </Context.Provider>
    </BrowserRouter>
);
