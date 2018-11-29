const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const {interface, bytecode} = require("../compile");

const INITIAL_MESSAGE_NAME = "Hi there";

let accounts;
let inbox;
beforeEach(async()=>{
    //Get a list of all accounts

    accounts = await  web3.eth.getAccounts();

    //Use one of the these accounts to deploy
    //the contract

    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: [INITIAL_MESSAGE_NAME]})
        .send({from: accounts[0], gas: "1000000"});

});

describe("Inbox", () => {
    it ("deploy a contract", () => {
        assert.ok(inbox.options.address);
    });

    it("has a default message", async () => {
        const message = await inbox.methods.message().call();
        assert.strictEqual(INITIAL_MESSAGE_NAME, message );

    });
    it("modify message", async () => {
        const newMessage = "a new message";
        await inbox.methods.setMessage(newMessage).send({ from : accounts[0]});
        const message = await inbox.methods.message().call();
        assert.strictEqual(newMessage, message );

    })
});



//
//
//
//
//
// class Car{
//     park(){
//         return "stopped";
//     }
//     drive(){
//         return "drive";
//     }
// }
// let car;
// beforeEach(() => {
//     car = new Car();
//
//
// });
// describe("Car",() => {
//     it("can park",() => {
//
//         assert.strictEqual(car.park(), "stopped");
//     });
//     it("can drive",() => {
//
//         assert.strictEqual(car.drive(), "drive");
//     });
// });