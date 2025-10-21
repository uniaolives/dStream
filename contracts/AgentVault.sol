// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentVault {
    address public tokenA;
    address public tokenB;
    uint256 public initialRatio;

    constructor(address _tokenA, address _tokenB, uint256 _initialRatio) {
        tokenA = _tokenA;
        tokenB = _tokenB;
        initialRatio = _initialRatio;
    }
}
