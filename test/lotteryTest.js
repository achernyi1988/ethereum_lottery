const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const {interface, bytecode} = require("../compile");


let accounts;
let lottery;

beforeEach(async()=>{
    //Get a list of all accounts

    accounts = await  web3.eth.getAccounts();

    //Use one of the these accounts to deploy
    //the contract

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: "1000000"});

});

describe("Lottery contract",()=> {

    it("deploys a contract", () => {
       assert.ok(lottery.options.address);
    });
    it("enter check if player added", async ()=> {
        await  lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei("0.02", "ether")
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.strictEqual(accounts[0], players[0]);
        assert.strictEqual(1, players.length);
    });

    it("allows multiple accounts to enter", async ()=> {

        let counter = 0;
        await  lottery.methods.enter().send({
            from: accounts[counter++],
            value: web3.utils.toWei("0.02", "ether")
        });
        await  lottery.methods.enter().send({
            from: accounts[counter++],
            value: web3.utils.toWei("0.02", "ether")
        });
        await  lottery.methods.enter().send({
            from: accounts[counter++],
            value: web3.utils.toWei("0.02", "ether")
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.strictEqual(accounts[0], players[0]);
        assert.strictEqual(accounts[1], players[1]);
        assert.strictEqual(accounts[2], players[2]);
        assert.strictEqual(counter, players.length);
    });

    it("requires a minimum amount of ether to enter", async ()=> {
        console.log("requires a minimum amount of ether to enter");
        try {
        await  lottery.methods.enter().send({
            from: accounts[0],      //low value.
            value: web3.utils.toWei("1", "ether")
        });
    }catch(err) {
            assert(false);
    }

    });
    it("only manager can call pickWinner", async ()=> {
        try {
            await  lottery.methods.pickWinner().send({
                from: accounts[0]
            });
        }catch (err) {
            assert(false);
        }
    });
    it("sends money to the winner and resets the players array", async() =>{

        await  lottery.methods.enter().send({
           from: accounts[0],
           value:  web3.utils.toWei("2", "ether")
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({from: accounts[0]});

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;

        assert(difference > web3.utils.toWei("1.8", "ether"));

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert(players.length == 0);
    });

});