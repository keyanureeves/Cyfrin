//SPDX-License-Identifier:MIT

pragma solidity 0.8.19;

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

