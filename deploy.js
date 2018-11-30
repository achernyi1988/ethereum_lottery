const HWWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const {interface, bytecode} = require("./compile");

const provider = new HWWalletProvider(
    'velvet weasel owner rookie agree fit cushion like burden dance tragic lock',
    'https://rinkeby.infura.io/v3/57028538b43b43ba80e3f61b7e6b5390'
);


const web3 = new Web3(provider);
const deploy = async () => {

    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account = ", accounts);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({gas: '1000000', from: accounts[0]});

    console.log("Contract deployed to", result.options.address);
};
deploy();
