import React, { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import './App.css';
import abi from "./utils/issueCertificate.json"

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractABI = abi.abi;

  const [form, setForm] = useState({
    ra: 0,
    hoursDone: 0,
    name: "",
    link: ""
  });

  const issueCertificate = async (form) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const issueCertificate = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("Emitindo certificado.");
        let certificate = {
          "RA": parseInt(form.ra),
          "hoursDone": parseInt(form.hoursDone),
          "name": form.name,
          "link": form.link
        }
        let xpto = await issueCertificate.issueNewCertificate(certificate);

        console.log("Minerando...", xpto.hash);
        await xpto.wait();
        console.log("Minerado -- ", xpto.hash);
        
        let certificates = await issueCertificate.getCertificatesByRA(parseInt(form.ra))
        console.log(certificates)

      } else {
        console.log("Objeto Ethereum não encontrado!");
      }
    } catch (error) {
      console.log(error)
    }}


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // const parsedValue = (name === "ra" || name === "hoursDone") && value !== undefined && typeof value === 'string' ? new BigNumber(value) : value;
    setForm({ ...form, [name]: value });
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Formulário enviado:", form);
    await issueCertificate(form)
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Garanta que possua a Metamask instalada!");
        return;
      } else {
        console.log("Temos o objeto ethereum", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Encontrada a conta autorizada:", account);
        setCurrentAccount(account)
      } else {
        console.log("Nenhuma conta autorizada foi encontrada")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("MetaMask encontrada!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        Emitir certificado
        </div>


        <form onSubmit={handleSubmit}>
          <label htmlFor="ra">RA:</label>
          <input type="number" id="ra" name="ra" value={form.ra} onChange={handleInputChange} min="0" />

          <label htmlFor="hoursDone">Horas Trabalhadas:</label>
          <input type="number" id="hoursDone" name="hoursDone" value={form.hoursDone} onChange={handleInputChange} min="0" />

          <label htmlFor="name">Nome:</label>
          <input type="text" id="name" name="name" value={form.name} onChange={handleInputChange} />

          <label htmlFor="link">Link:</label>
          <input type="text" id="link" name="link" value={form.link} onChange={handleInputChange} />

          <button type="submit">Enviar Formulário</button>
        </form>

        {/*
        * Se não existir currentAccount, apresente este botão
        */}
        {!currentAccount && (
          <button type="submit" onClick={connectWallet}>
            Conectar carteira
          </button>
        )}

      </div>
      
    </div>
  );
}
