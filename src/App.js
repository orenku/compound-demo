import Web3 from "web3/dist/web3.min.js";
import React, { useState } from "react";
import {Button, TextField, Card, Stack} from '@mui/material';
import {contractAbi} from './contracts_CEther_sol_CEther.js';


import './App.css';

function App() {
  const [data, setdata] = useState({
    address: '',
    Balance: null,
  });
  const [tokens, setTokens] = useState({
    depositTokenSymbol: 'ETH',
    depositTokenValue: '',
    withdrawTokenSymbol: 'ETH',
    withdrawTokenValue: '',
  });
  const [networkId, setNetworkId] = useState('');

  const cEtherContractAddress = '0x20572e4c090f15667cF7378e16FaD2eA0e2f3EfF';
 

  const init = async () => {
    const contractAddress = '0x20572e4c090f15667cf7378e16fad2ea0e2f3eff';
    const web3 = new Web3(window.ethereum);
    const id = await web3.eth.net.getId();
    const contract = new web3.eth.Contract(contractAbi.abi, contractAddress);
    setNetworkId(id);
    console.log('Initialized', networkId, contract);
  }


  
  const connectWallet = () => {
    if (window.ethereum) {
      init();
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => {
          setdata({
            address: res[0],
          });
        });
    } else {
      alert("install metamask extension!!");
    }
  };

  const deposit = async () => {
    console.log('Deposit', tokens);

    const transactionParameters = {
      nonce: '0x00',
      to: cEtherContractAddress, 
      from: data.address,
      value: tokens.depositTokenValue,
      data:
        '0x1249c58b', 
      chainId: '0x5',
    };
    
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });

    console.log('txHash=', txHash);

  }

  const withdraw = async () => {
    console.log('withdraw');

    console.log('Deposit', tokens);

    console.log(addLeadingZeros(tokens.withdrawTokenValue, 32));

    const transactionParameters = {
      nonce: '0x00',
      to: cEtherContractAddress, 
      from: data.address,
      data:
        '0xdb006a75'+  //redeem
        addLeadingZeros(tokens.withdrawTokenValue),
      chainId: '0x5',
    };
    
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });

    console.log('txHash=', txHash);
  }

  const getInfo = () => {
    console.log('getInfo');
  }

  const  addLeadingZeros = (num, totalLength) => {
    return String(num).padStart(totalLength, '0');
  }
  
  return (
    <div className="App">
      <TextField id="networkId" label="Network Id" value={networkId} />
      <TextField id="address" style={{width: '400px'}} label="Address" value={data.address} />
      <Button variant="contained"  onClick={connectWallet} >Connect</Button>
      <Card variant="outlined">
        <h1>Compound</h1>
        <Stack
          component="form"
          sx={{
            width: '25ch',
          }}
          spacing={2}
          noValidate
          autoComplete="off"
        >
          <TextField id="address" label="Token Symbol" variant="filled" value={tokens.depositTokenSymbol} />
          <TextField id="address" label="Value" variant="filled" InputLabelProps={{shrink: true}} 
            value={tokens.depositTokenValue} 
            onChange={(e) => setTokens({...tokens, depositTokenValue: e.target.value})} />
          <Button variant="contained"  onClick={deposit} >Deposit</Button>

          <TextField id="address" label="Token Symbol" variant="filled" value={tokens.withdrawTokenSymbol} />
          <TextField id="address" label="Value" variant="filled" InputLabelProps={{shrink: true}} 
            value={tokens.withdrawTokenValue} 
            onChange={(e) => {console.log('$$$',tokens, e); setTokens({...tokens, withdrawTokenValue: e.target.value})}}
          />
          <Button variant="contained"  onClick={withdraw} >Withdraw</Button>
          </Stack>
      </Card>

      <Card variant="outlined">
        <h1>Compound</h1>
        <Button variant="contained"  onClick={getInfo} >Get Info</Button>
      </Card>

    </div>
  );
}

export default App;
