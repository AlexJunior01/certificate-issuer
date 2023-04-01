 import React, { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import './App.css';
import abi from "./utils/issueCertificate.json"
import { Tabs, Tab, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { ListGroup } from 'react-bootstrap';

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
      return certificates

    } else {
      console.log("Objeto Ethereum não encontrado!");
    }
  } catch (error) {
    console.log(error);
  }
};



function BuscaTab() {
  const [ra, setRa] = useState("");
  const [certificates, setCertificates] = useState([]);

  const handleRaChange = (event) => {
    setRa(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    console.log("Buscando certificados para RA:", ra);
    const foundCertificates = await searchCertificates(ra);
    setCertificates(foundCertificates);
  };

  return (
    <>
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
    <div className="list-group-container">
      <ListGroup className="custom-list-group">
        {certificates.map((certificate, index) => (
          <ListGroup.Item key={index} className="list-group-item">
            <Row className="justify-content-md-center">
              <Col md={5}>
                <p>Nome: {certificate.name}</p>
                <p>RA: {certificate.RA.toString()}</p>
              </Col>
              <Col md={5}>
                <p>Horas Concluídas: {certificate.hoursDone.toString()}</p>
                <p>Data: {new Date(certificate.issueDate * 1000).toDateString()}</p>
              </Col>
            </Row>
            <Row className="justify-content-center mt-2">
              <Col xs="auto">
                <a href={certificate.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary">
                    Abrir Certificado
                  </Button>
                </a>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  </>
    
  );
}



export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [activeKey, setActiveKey] = useState("emissao");
  const [isConnected, setIsConnected] = useState(false);


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
        setIsConnected(true);
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

  function ErrorScreen() {
    return (
      <div className="error-screen form-container">
        <h2 className="error-title">Você precisa se conectar na Metamask</h2>
        <p className="error-content">Por favor, conecte-se à sua carteira MetaMask para continuar usando o aplicativo.</p>
      </div>
    );
  }

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
        <Tab eventKey="busca" title="Busca">
          <BuscaTab />
        </Tab>
        <Tab eventKey="emissao" title="Emissão">
        {isConnected ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="ra">RA</label>
                <input
                  type="text"
                  className="form-control"
                  id="ra"
                  name="ra"
                  value={form.ra === 0 ? "" : form.ra}
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
                  value={form.hoursDone === 0 ? "" : form.hoursDone}
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
          ) : (
            <ErrorScreen />
          )}
        </Tab>
      </Tabs>
    </div>
  );

}
