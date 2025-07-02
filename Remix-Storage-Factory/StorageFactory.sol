// SPDX-License-Identifier: MIT
pragma solidity >=0.8.18;

import {SimpleStorage, SimpleStorage2} from "./SimpleStorage.sol";

contract StorageFactory {
    address[] public listOfStorageAddresses;

    function createSimpleStorageContract() public {
        SimpleStorage newSimpleStorageContract = new SimpleStorage();
        listOfStorageAddresses.push(address(newSimpleStorageContract)); // push address
    }

    function sfStore(uint _simpleStorageIndex, uint _newSimpleStoragenumber) public {
        // Get address from array and typecast to SimpleStorage
        SimpleStorage mySimpleStorage = SimpleStorage(listOfStorageAddresses[_simpleStorageIndex]);
        mySimpleStorage.store(_newSimpleStoragenumber); // Call store method
    }

    function sfGet(uint _simpleStorageIndex) public view returns (uint) {
        SimpleStorage mySimpleStorage = SimpleStorage(listOfStorageAddresses[_simpleStorageIndex]);
        return mySimpleStorage.retrieve(); // Assume retrieve() returns the stored number
    }
}
