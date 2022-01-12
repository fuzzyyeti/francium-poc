import React, {useEffect, useState} from 'react';
import { useParams, RouteProps } from 'react-router-dom';
import web3, {PublicKey} from '@solana/web3.js';
import './App.css';
import Dashboard from "./Components/Dashboard";
function App() {
  const [publicKey, setPublicKey] = useState('FtF3PVw8YNJseWPMcA2GEuQZ6nni1mq5kYPa2LrSzfkW');
//  const [publicKey, setPublicKey] = useState('7yTohrf6Hs6uQwiJHbLpdM1hhDaimURvBMAsZdys5JmD');
  type DashboardParams = { publicKey: string };
  const params = useParams<DashboardParams>();

  useEffect(() => {
    if(params.publicKey)
    {
      try {
        const pubkey = new PublicKey(params.publicKey);
        if (pubkey) {
          if (PublicKey.isOnCurve(pubkey.toBytes())) {
            setPublicKey(pubkey.toBase58());
          }
        }
      }
      catch
      {
        console.log("Invalid pubkey in URL");
      }
    }}
    ,[]);
  return (
    <div className="App">
      <header className="App-header">
        <Dashboard publicKey={publicKey}/>
      </header>
    </div>
  );
}

export default App;
