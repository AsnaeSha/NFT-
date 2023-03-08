require("dotenv").config();
const api_url = process.env.API_URL;
const public_key = process.env.PUBLIC_KEY;
const private_key = process.env.PRIVATE_KEY;
const { createAlchemyWeb3 } = require ("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(api_url);
const contract = require ("../artifacts/contracts/nft.sol/MyNFT.json");

//console.log(JSON.stringify(contract.abi))

const contractAddress = "0x51A42D62EE93b795646fbc8637faDa24F049f8EE";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI){
  const nonce = await web3.eth.getTransactionCount(public_key,"latest");
  const tx={
    from:public_key,
    to:contractAddress,
    nonce:nonce,
    gas:500000,
    data:nftContract.methods.mint(public_key,tokenURI).encodeABI(),
  };
  const signPromise = web3.eth.accounts.signTransaction(tx, private_key);

  return signPromise.then((signedTx) => {
    return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  }).then((receipt) => {
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    return receipt.transactionHash;
  }).catch((err) => {
    console.error(err);
  });
}

// Call the mintNFT function with the recipient and tokenURI parameters
mintNFT("https://gateway.pinata.cloud/ipfs/QmWLCego73fJe67SiXhNLcBUBLR376SdBsbtXK57cKfgqR");



//Transaction hash: 0x6ffc3c4c0d34e950e2f21c54e4bbf68dc92c2d884b20c7a3bad98b4d7c0f9f0f
