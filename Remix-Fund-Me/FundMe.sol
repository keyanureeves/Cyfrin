// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19; 



import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    //libraries dont have state variables and functions are marked internal

     function getPrice ()internal view returns (uint256) {
        //address 0x694AA1769357215DE4FAC081bf1f309aDC325306
        //ABi - list of functions that we can call from a contract
        // Instantiate the Chainlink price feed interface
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );

        // Get the latest ETH/USD price data
        (, int256 answer, , , ) = priceFeed.latestRoundData();

        // Chainlink returns the ETH price with 8 decimals
        // We multiply by 1e10 to match 18-decimal precision like wei
        return uint256(answer) * 1e10;
    }


function getConversionRate(uint256 ethAmount) internal view returns (uint256){
       
        uint256 ethPrice = getPrice(); // ETH/USD with 18 decimals
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
}

function getVersion () internal view returns (uint256){
        return    AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306).version();
    }

}

error NotOwner();

contract FundMe {

    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 5e18;

    address [] public funders;
    address public immutable i_owner;

    mapping (address funder => uint256 amountFunded) public addressToAmountFunded;

    constructor (){
        i_owner = msg.sender;
    }

    modifier onlyOwner(){
       // require(msg.sender == i_owner,"Not the owner!");
       if (msg.sender != i_owner){ revert NotOwner();}
        _;
    }



    //allows users to send $
    //Have a minimum $ sent
    //1. How do we send ETH to this comntract
    function fund() public payable {
        require(msg.value >= MINIMUM_USD,"The minimum amount is 5$");
        
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] +=  msg.value;
        //1e18 = 1 ETH = 1*10**18 // use ether converter site 
        // revert - Undo any actions that have been done, hand send the remaining gas back

    }


    function withdraw () public  onlyOwner {
        require(msg.sender == i_owner,"Not the owner!");
        //for loop - to do something a repeated number of times 
        //[1,2,3,4] elements 
        // 0,1,2,3  indexes 
        //for(/*starting index, ending index, step amount */)

        for(uint256 funderIndex = 0; funderIndex<funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        // reset the array
        funders = new address [](0); // the new keyword to initialise the funders array into a new array called addresses 

          //withdraw the funds 
          //transfer, send , call

          //** transfer - the transaction reverts in case of an error
          //msg.sender = address
          // payable(msg.sender) - payable address
           // payable(msg.sender.transfer(address(this).balance);

            //** send
           // bool sendSuccess = payable(msg.sender).send(address(this.balance);
           // require(sendSuccess, "Send failed");

            // ** call - lower level and extremely function and can call any function without using the abi 
            //gasless calls don't revert in case of an error
            //msg.sender = address 
            // it returns two variables 

            //***call is the recommended way to send and receive tokens or native blockchain tokens ***//

            (bool callSuccess, )=payable(msg.sender).call{value: address(this).balance}("");
            require(callSuccess, "Call failed");



    }



    //receive and fallback functions 

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }



    
  


    

   
}