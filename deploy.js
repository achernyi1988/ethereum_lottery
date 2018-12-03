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

    console.log("interface = ",  interface);
    console.log("Contract deployed to", result.options.address);



    // await  result.methods.enter().send({
    //     from: accounts[0],
    //     value:  web3.utils.toWei("0.000002", "ether"),
    //     gas: '1000000'
    // });
    // const balance = await web3.eth.getBalance(accounts[0]);
    // console.log("balance = ", balance);
    //
    // let players = await result.methods.getPlayers().call({
    //     from: accounts[0]
    // });
    // console.log("players.length = ", players.length);
    // await  result.methods.pickWinner().send({from: accounts[0], gas: '1000000'})
    //     .once('transactionHash', function (txHash) {
    //         console.log('transactionHash', txHash);
    //     })
    //     .once('confirmation', function(confirmationNumber, receipt) {
    //         console.log('confirmation', confirmationNumber, receipt);
    //     })
    //     .once('receipt', function(receipt) {
    //         console.log('receipt', receipt);
    //     })
    //     .once('error', function(error) {
    //         console.log('error', error);
    //     });
    //
    // const finalBalance = await web3.eth.getBalance(accounts[0]);
    // console.log("finalBalance = ", finalBalance);
    //
    // players = await result.methods.getPlayers().call({
    //     from: accounts[0]
    // });
    // console.log("players.length after  pickWinner = ", players.length);
};
deploy();