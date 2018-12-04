pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address [] public players;
    address public winner;
    function Lottery() public {
        manager = msg.sender;
        winner = 0;
    }

    function enter() public payable {
        require(msg.value > .000001 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint){
        return uint(sha256(block.difficulty, now, players));
    }

    function pickWinner() public managerRestricted playerRestricted payable {

        uint index = random() % players.length;
        players[index].transfer(this.balance);
        winner = players[index];
        players = new address[] (0);

    }

    function getPlayers() public view returns (address[] ){
        return players;
    }

    modifier managerRestricted(){
        require(msg.sender == manager);
        _;
    }

    modifier playerRestricted(){
        require(0 != players.length);
        _;
    }

}