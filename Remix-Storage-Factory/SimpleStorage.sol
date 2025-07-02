
// SPDX-License-Identifier: MIT

pragma solidity >=0.8.19;

// pragma solidity ^0.8.0;
// pragma solidity >=0.8.0 <0.9.0;




contract SimpleStorage {
    //favouriteNumber gets initiaised to 0 if no value is given
    uint256 myFavoriteNumber;

    //custom data type 
    struct Person {
        uint256 favoriteNumber;
        string name;
    }
    // uint256[] public anArray; a dynamic array
    Person[] public listOfPeople;

    //mappings of name to favouriteNumber (keya-> 7)
    mapping(string => uint256) public nameToFavoriteNumber;

    //store function that stores and updates myFavoriteNumber
    function store(uint256 _favoriteNumber) public virtual {
        myFavoriteNumber = _favoriteNumber;
    }

    //pure and view functions cannot cahnge the state of the blockchain hence cost no gas 
    function retrieve() public view returns (uint256) {
        return myFavoriteNumber;
    }

    

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        listOfPeople.push(Person(_favoriteNumber, _name));
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }


}

contract SimpleStorage2{}
contract SimpleStorage3{}
contract SimpleStorage4{}
