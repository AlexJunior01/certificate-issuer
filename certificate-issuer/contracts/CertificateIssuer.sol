// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0; // versão do compilador do Solidity que será utilizado

import "hardhat/console.sol";


contract CertificateIssuer {
    struct CertificateInput {
        int RA;
        int hoursDone;
        string name;
        string link;
    }

    struct Certificate {
        int RA;
        int hoursDone;
        string name;
        string link;
        uint256 issueDate;
    }

    address public owner;
    uint256 numCertificates;

    mapping (int => Certificate[]) raCertificates;

    constructor() {
        console.log("Inicializando contrato.");
        owner = msg.sender;

        console.log("Dono do contrato: %s", msg.sender);
    }
    
    function issueNewCertificate(CertificateInput calldata newCertificate) public {
        require(msg.sender == owner, "Somente o dono do contrato pode realizar esse operacao.");
        int ra = newCertificate.RA;

        Certificate memory certificate = Certificate({
            RA: newCertificate.RA,
            hoursDone: newCertificate.hoursDone,
            name: newCertificate.name,
            link: newCertificate.link,
            issueDate: block.timestamp
        });

        raCertificates[ra].push(certificate);
        
        return;
    }

    function getCertificatesByRA(int RA) public view returns(Certificate[] memory) {
        return raCertificates[RA];
    }



}