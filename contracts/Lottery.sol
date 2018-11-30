pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address [] public players;
    function Lottery() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .000001 ether);
        players.push(msg.sender);
    }
    
    function random() private view returns (uint){
        return uint(sha256(block.difficulty, now, players));
    }
    
    function pickWinner() public restricted payable {
        if(0 != players.length){
            uint index = random() % players.length;
            players[index].transfer(this.balance);

             players = new address[] (0);
        }
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