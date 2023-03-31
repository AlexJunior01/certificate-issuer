import React, { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import './App.css';
import abi from "./utils/issueCertificate.json"
import { Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = abi.abi;

const searchCertificates = async (ra) => {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const issueCertificateContract = new ethers.Contract(contractAddress, contractABI, signer);

      console.log("Buscando certificados para RA:", ra);
      let certificates = await issueCertificateContract.getCertificatesByRA(parseInt(ra));
      console.log(certificates);
    } else {
      console.log("Objeto Ethereum não encontrado!");
    }
  } catch (error) {
    console.log(error);
  }
};



function BuscaTab() {
  const [ra, setRa] = useState("");

  const handleRaChange = (event) => {
    setRa(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    console.log("Buscando certificados para RA:", ra);
    searchCertificates(ra);
  };

  return (
    <form onSubmit={handleSearch}>
      <div className="form-group">
        <label htmlFor="ra">RA</label>
        <input
          type="text"
          className="form-control"
          id="ra"
          name="ra"
          value={ra}
          onChange={handleRaChange}
        />
      </div>
      <button type="submit" className="btn btn-primary">Pesquisar</button>
    </form>
  );
}



export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [activeKey, setActiveKey] = useState("emissao");

  //-------------- Contrato --------------//

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

  //-------------- Connext Wallet --------------//

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

  //-------------- React --------------//
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // const parsedValue = (name === "ra" || name === "hoursDone") && value !== undefined && typeof value === 'string' ? new BigNumber(value) : value;
    setForm({ ...form, [name]: value });
  };

  const handleSelect = (key) => {
    setActiveKey(key);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Formulário enviado:", form);
    await issueCertificate(form)
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  //-------------- App --------------//

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hackoonspace</h1>
        <p className="subtitulo"> Emissão e Busca de Certificados</p>
        {currentAccount ? (
          <p className="connected-account">Endereço da conta conectada: {currentAccount}</p>
        ) : (
          <button onClick={connectWallet}>Conectar carteira</button>
        )}
      </header>
      <Tabs activeKey={activeKey}
            onSelect={handleSelect}
            id="certificados-tabs"
            defaultActiveKey="emissao">
        <Tab eventKey="emissao" title="Emissão">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="ra">RA</label>
              <input
                type="text"
                className="form-control"
                id="ra"
                name="ra"
                value={form.ra}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="hoursDone">Horas Concluídas</label>
              <input
                type="text"
                className="form-control"
                id="hoursDone"
                name="hoursDone"
                value={form.hoursDone}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="link">Link</label>
              <input
                type="text"
                className="form-control"
                id="link"
                name="link"
                value={form.link}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Emitir Certificado
            </button>
          </form>
        </Tab>
        <Tab eventKey="busca" title="Busca">
          <BuscaTab />
        </Tab>
      </Tabs>
    </div>
  );

}
