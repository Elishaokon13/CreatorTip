// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract CreatorTip is ERC721URIStorage, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    uint256 private _tokenIdCounter;
    address public openActionAddress;
    /// @dev Constant representing native token (MATIC on Polygon, ETH on Base, etc.)
    address public constant NATIVE_TOKEN = address(0);
    /// @dev Chain ID for Lens Testnet (37111)
    uint256 public constant LENS_CHAIN_ID = 37111;
    mapping(address => bool) public supportedTokens; // Whitelist for USDC, POL, etc.
    mapping(address => uint8) private _tokenDecimals; // Token decimals mapping

    event Tipped(address indexed creator, address indexed tipper, uint256 amount, address token, uint256 chainId);
    event SupporterNFTMinted(address indexed tipper, uint256 tokenId, string tokenURI);
    event TokenAdded(address token);
    event TokenRemoved(address token);

    constructor(address _openActionAddress, address[] memory _initialTokens) 
        ERC721("CreatorTip Supporter", "CTS") 
    {
        require(_openActionAddress != address(0) || block.chainid == LENS_CHAIN_ID, "CreatorTip: invalid Open Action address");
        openActionAddress = _openActionAddress;
        uint256 len = _initialTokens.length;
        for (uint256 i = 0; i < len; ) {
            supportedTokens[_initialTokens[i]] = true;
            emit TokenAdded(_initialTokens[i]);
            unchecked { ++i; }
        }
    }

    modifier onlyOpenAction() {
        if (openActionAddress == address(0) && block.chainid == LENS_CHAIN_ID) {
            _;
        } else {
            require(msg.sender == openActionAddress, "CreatorTip: caller is not authorized Open Action");
            _;
        }
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
        require(supportedTokens[token] || token == NATIVE_TOKEN, "CreatorTip: unsupported token");

        address tipper = tx.origin;

        if (token == NATIVE_TOKEN) {
            // Native token transfer: MATIC on Polygon, ETH on Base, etc.
            require(msg.value == amount, "CreatorTip: incorrect native token amount");
            (bool sent, ) = creator.call{value: amount}("");
            require(sent, "CreatorTip: native token transfer failed");
        } else {
            IERC20(token).safeTransferFrom(tipper, creator, amount);
        }

        emit Tipped(creator, tipper, amount, token, block.chainid);
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

    /**
     * @dev Sets the decimals for a supported token. Callable by owner.
     */
    function setTokenDecimals(address token, uint8 decimals) external onlyOwner {
        require(supportedTokens[token], "CreatorTip: token not supported");
        _tokenDecimals[token] = decimals;
    }

    function removeSupportedToken(address token) external onlyOwner {
        require(supportedTokens[token], "CreatorTip: token not supported");
        supportedTokens[token] = false;
        emit TokenRemoved(token);
    }

    /**
     * @dev Returns the decimals for a given token, falling back to IERC20Metadata or 18.
     */
    function getTokenDecimals(address token) external view returns (uint8) {
        if (token == address(0)) {
            return 18;
        }
        uint8 decimals = _tokenDecimals[token];
        if (decimals == 0) {
            // Try to fetch from token contract
            try IERC20Metadata(token).decimals() returns (uint8 d) {
                return d;
            } catch {
                return 18;
            }
        }
        return decimals;
    }

    function setOpenActionAddress(address newAddress) external onlyOwner {
        require(newAddress != address(0), "CreatorTip: invalid Open Action address");
        openActionAddress = newAddress;
    }

    function getTokenIdCounter() external view returns (uint256) {
        return _tokenIdCounter;
    }
}