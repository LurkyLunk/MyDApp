// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract Shikoba is ERC20, ERC20Burnable,Pausable, Ownable {
    constructor() ERC20("Shikoba", "SHKI") {
        _mint(msg.sender, 10000000 * 10**18);
    }

    // A function to mint new tokens. Only callable by the contract owner.
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // A function to pause all token transfers. Only callable by the contract owner.
    function pause() public onlyOwner {
        _pause();
    }

    // A function to resume token transfers. Only callable by the contract owner.
    function unpause() public onlyOwner {
        _unpause();
    }
}
