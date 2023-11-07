import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const { ethereum } = window; // Access `ethereum` here instead of at the top level
    if (!ethereum) {
        console.error('Ethereum object not found, you should install MetaMask!');
        return null; // Return null or throw an error
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract; // Return the contract instance
}


export const TransactionProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setFormData] = useState({addressTo: '', amount: '', keyword: '', message: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Please install Metamask");
    
            const accounts = await ethereum.request({ method: 'eth_accounts' }); // added await here
    
            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            } else {
                console.log('No accounts found at initialization');
            }
    
            console.log(accounts);
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum Object");
        }
    }
    

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask");

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum Object");
        }
    }

    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask");

            const { addressTo, amount, keyword, message } = formData;

            const transactionContract = getEthereumContract();

            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', //21000 GWEI
                    value: parsedAmount._hex, //0.00001
                }]
            })

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();

            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionCount.getTransactionCount();

            setTransactionCount(transactionCount.toNumber());
            
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum Object");
        }
    }

    useEffect(() => {
      checkIfWalletIsConnected();
    }, [])
    
    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction }}>{children}</TransactionContext.Provider>
    );
}
