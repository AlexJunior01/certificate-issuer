// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0; // versão do compilador do Solidity que será utilizado

import "hardhat/console.sol";


contract CertificateIssuer {
    struct Certificate {
        string RA;
        int hoursDone;
        string name;
        string link;
    }

    address public owner;
    uint256 numCertificates;

    Certificate[] certificates;

    constructor() {
        console.log("Inicializando contrato.");
        owner = msg.sender;

        console.log("Dono do contrato: %s", msg.sender);
    }
    
    function issueNewCertificate(Certificate calldata newCertificate) public returns (uint256) {
        require(msg.sender == owner, "Somente o dono do contrato pode realizar esse operacao.");

        certificates.push(newCertificate);

        console.log("CERTIFICATE: %s", certificates[0].RA);
        numCertificates += 1;

        console.log("%s certificados emitidos", numCertificates);
        
        return numCertificates;
    }


}