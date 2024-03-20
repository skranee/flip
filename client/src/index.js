import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import GlobalStore from "./globalStore/globalStore";
import {BrowserRouter} from "react-router-dom";
import Store from "./store/store";

const globalStore = new GlobalStore();
const store = new Store();

export const Context = createContext({
    globalStore,
    store
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Context.Provider value={{
            globalStore,
            store
        }}>
            <App />
        </Context.Provider>
    </BrowserRouter>
);
