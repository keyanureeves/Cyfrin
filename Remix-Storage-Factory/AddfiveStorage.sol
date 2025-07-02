// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {SimpleStorage} from "./SimpleStorage.sol";

contract AddFiveStorage is SimpleStorage{ 

    //overrides 
    //virtual overrides // virtual functions 

    function store( uint _newNumber) public  override  {

    }

}