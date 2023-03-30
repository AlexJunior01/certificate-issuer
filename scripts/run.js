const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const certificateContractFactory = await hre.ethers.getContractFactory("CertificateIssuer");
    const certificateContract = await certificateContractFactory.deploy();
    await certificateContract.deployed()


    console.log("Contract deployed to:", certificateContract.address);
    console.log("Contract deployed by:", owner.address);

    let certificate = {
        "RA": "760921",
        "hoursDone": 60,
        "name": "Projeto BlockChain 1.0",
        "link": "https://drive.google.com/file/d/1FBYXtkKDeTElFe5sYTc7mJDKLEXq8jTP/view?usp=share_link"
    }

    let numContracts;

    numContracts = await certificateContract.issueNewCertificate(certificate);
    
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