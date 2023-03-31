const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const certificateContractFactory = await hre.ethers.getContractFactory("CertificateIssuer");
    const certificateContract = await certificateContractFactory.deploy();
    await certificateContract.deployed()


    console.log("Contract deployed to:", certificateContract.address);
    console.log("Contract deployed by:", owner.address);

    let certificate = {
        "RA": 760921,
        "hoursDone": 60,
        "name": "Projeto BlockChain 1.0",
        "link": "https://drive.google.com/file/d/1FBYXtkKDeTElFe5sYTc7mJDKLEXq8jTP/view?usp=share_link"
    }

    let certificate2 = {
        "RA": 760921,
        "hoursDone": 90,
        "name": "HackoonSpace 2023/1.",
        "link": "https://drive.google.com/file/d/1FBYXtkKDeTElFe5sYTc7mJDKLEXq8jTP/view?usp=share_link"
    }

    let certificateID;

    certificateID = await certificateContract.issueNewCertificate(certificate);
    await certificateID.wait(); // aguarda a transação ser minerada

    certificateID = await certificateContract.issueNewCertificate(certificate2);
    await certificateID.wait(); // aguarda a transação ser minerada
    
    let certificates = await certificateContract.getCertificatesByRA(760921)
    console.log(certificates)
}


const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
  
runMain();