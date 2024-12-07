// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./interfaces/IAggregatorOracle.sol";
import "./interfaces/IPriceOracle.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AggregatorOracle is IAggregatorOracle, Ownable {
    // Mapping of token to array of oracles
    mapping(address => address[]) public tokenOracles;

    // Constructor to initialize the owner
    constructor(address initialOwner) Ownable(initialOwner) {}

    // Add a new oracle for a token
    function addOracle(address token, address oracle) external onlyOwner {
        tokenOracles[token].push(oracle);
    }

    // Remove an oracle for a token
    function removeOracle(address token, address oracle) external onlyOwner {
        address[] storage oracles = tokenOracles[token];
        for (uint256 i = 0; i < oracles.length; i++) {
            if (oracles[i] == oracle) {
                oracles[i] = oracles[oracles.length - 1];
                oracles.pop();
                break;
            }
        }
    }

    // Get the median price of a token
    function getMedianPrice(address token) external view override returns (uint256) {
        address[] memory oracles = tokenOracles[token];
        require(oracles.length > 0, "No oracles for token");

        uint256[] memory prices = new uint256[](oracles.length);
        for (uint256 i = 0; i < oracles.length; i++) {
            prices[i] = IPriceOracle(oracles[i]).getPrice(token);
        }

        // Sort prices (simple bubble sort for demonstration purposes)
        for (uint256 i = 0; i < prices.length; i++) {
            for (uint256 j = i + 1; j < prices.length; j++) {
                if (prices[j] < prices[i]) {
                    uint256 temp = prices[i];
                    prices[i] = prices[j];
                    prices[j] = temp;
                }
            }
        }

        uint256 median = prices[prices.length / 2];
        return median;
    }
}
