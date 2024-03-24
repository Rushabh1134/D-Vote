"use client";
import React, { use, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
const pinataSDK = require('@pinata/sdk');
import { useRouter } from 'next/navigation';





import { VotingAddress, VotingAddressABI } from "./constants";



const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const fetchContract = (signerOrProvider) => new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);
export const VotingContext = React.createContext();
export const VotingProvider = ({ children }) => {

  const votingTitle = 'My first smart contract app';

  const [currentAccount, setCurrentAccount] = useState('');
  const [candidateLength, setCandidateLength] = useState('');
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidaateArray, setCandidateArray] = useState(pushCandidate);

  const [error, setError] = useState('');
  const highestVote = [];

  const pushVoter = [];
  const [voterArray, setVoterArray] = useState(pushVoter);
  const [voterLength, setVoterLength] = useState();
  const [voterAddress, setVoterAddress] = useState([]);

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setError("Please Install Metamask");
    const account = await window.ethereum.request({
      method: "eth_accounts"
    });
    if (account.length) {
      setCurrentAccount(account[0]);
    } else {
      setError("Please Install Metamask & Connect, Reload");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return setError("Please Install Metamask");
    const account = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    setCurrentAccount(account[0]);
  }

  // const uploadToIPFS = async (file) => {
  //   try {
  //     const added = await client.add({ content: file });
  //     const url = `https://ipfs.infura.io/ipfs/${added.path}`;
  //     return url;
  //   } catch (error) {
  //     setError("Error Uploading File to IPFS");
  //   }
  // }

const router = useRouter();
  const uploadToIPFS = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const resFile = await axios(
          {
            method: 'POST',
            url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
            data: formData,
            headers: {
              pinata_api_key: "6ff207e0519b5fdfeacf",
              pinata_secret_api_key: "28dc4c236abbac2d712db03e5f8b7814109d82d788245d307f5d055733c01874",
              "Content-Type": 'multipart/form-data',
            },
          }
        )
        // console.log("https://gateway.pinata.cloud/ipfs/"+resFile.data.IpfsHash);
        return `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
      }
      catch (error) {
        setError("Error Uploading File to IPFS");
      }
    }
  }

  const createVoter = async (formInput, fileUrl, router) => {
    try {
      const { name, address, position } = formInput;
      if (!name || !address || !position) return setError("Please Fill All Fields");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const data = JSON.stringify({ name, address, position, image: fileUrl });
      const res = await axios({
        method: 'POST',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        data: data,
        headers: {
          pinata_api_key: "6ff207e0519b5fdfeacf",
          pinata_secret_api_key: "28dc4c236abbac2d712db03e5f8b7814109d82d788245d307f5d055733c01874",
          "Content-Type": 'application/json',
        }
      }
      );
      jsonUrl = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      console.log(jsonUrl);
      const voter = await contract.voterRight(address, name, jsonUrl, fileUrl);
      voter.wait();

      router.push('/voterList');
    }
    catch (error) {
      setError("Error Creating Voter");
    }
  }

  const getAllVoterData = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const voterListData = await contract.getVoterList();
      setVoterAddress(voterListData);
      voterListData.map(async (el) => {
        const singleVoterData = await contract.getVoterdata(el);
        pushCandidate.push(singleVoterData);
      });

      const voterList = await contract.getVoterLength();
      setVoterLength(voterLength.toNumber());

      for (let i = 0; i < voterLength; i++) {
        const voter = await contract.voters(i);
        pushVoter.push(voter);
      }
      setVoterArray(pushVoter);
    }
    catch (error) {
      setError("Error Fetching Voter Data");
    }
  }

  return (
    <VotingContext.Provider value={{ checkIfWalletIsConnected, connectWallet, uploadToIPFS, createVoter, getAllVoterData }}>
      {children}
    </VotingContext.Provider>
  );
};


const Voter = () => {
  return (
    <div>voter</div>
  )
}

export default Voter