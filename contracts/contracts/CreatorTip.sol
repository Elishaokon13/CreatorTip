// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CreatorTip is ERC721URIStorage, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    uint256 private _tokenIdCounter;
    address public openActionAddress;
    mapping(address => bool) public supportedTokens; // Whitelist for USDC, POL, etc.

    event Tipped(address indexed creator, address indexed tipper, uint256 amount, address token);
    event SupporterNFTMinted(address indexed tipper, uint256 tokenId, string tokenURI);
    event TokenAdded(address token);
    event TokenRemoved(address token);

    constructor(address _openActionAddress, address[] memory _initialTokens) 
        ERC721("CreatorTip Supporter", "CTS") 
        Ownable(msg.sender) 
    {
        require(_openActionAddress != address(0), "CreatorTip: invalid Open Action address");
        openActionAddress = _openActionAddress;
        for (uint256 i = 0; i < _initialTokens.length; i++) {
            supportedTokens[_initialTokens[i]] = true;
            emit TokenAdded(_initialTokens[i]);
        }
    }

    modifier onlyOpenAction() {
        require(msg.sender == openActionAddress, "CreatorTip: caller is not authorized Open Action");
        _;
    }

    function tip(
        address creator,
        uint256 amount,
        address token,
        string calldata metadataURI
    ) external payable onlyOpenAction nonReentrant {
        require(creator != address(0), "CreatorTip: invalid creator address");
        require(amount > 0, "CreatorTip: tip amount must be greater than 0");
        require(bytes(metadataURI).length > 0, "CreatorTip: invalid metadata URI");
        require(supportedTokens[token] || token == address(0), "CreatorTip: unsupported token");

        address tipper = tx.origin;

        if (token == address(0)) {
            // Native token (GRASS, POL, ETH depending on chain)
            require(msg.value == amount, "CreatorTip: incorrect native token amount");
            (bool sent, ) = creator.call{value: amount}("");
            require(sent, "CreatorTip: native token transfer failed");
        } else {
            IERC20(token).safeTransferFrom(tipper, creator, amount);
        }

        emit Tipped(creator, tipper, amount, token);
        _mintSupporterNFT(tipper, metadataURI);
    }

    function _mintSupporterNFT(address to, string calldata metadataURI) internal {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        emit SupporterNFTMinted(to, tokenId, metadataURI);
        _tokenIdCounter += 1;
    }

    function addSupportedToken(address token) external onlyOwner {
        require(token != address(0), "CreatorTip: invalid token address");
        supportedTokens[token] = true;
        emit TokenAdded(token);
    }

    function removeSupportedToken(address token) external onlyOwner {
        require(supportedTokens[token], "CreatorTip: token not supported");
        supportedTokens[token] = false;
        emit TokenRemoved(token);
    }

    function setOpenActionAddress(address newAddress) external onlyOwner {
        require(newAddress != address(0), "CreatorTip: invalid Open Action address");
        openActionAddress = newAddress;
    }

    function getTokenIdCounter() external view returns (uint256) {
        return _tokenIdCounter;
    }
}