// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// CreatorTip: Allows tipping a creator in MATIC or an ERC20 token, and mints a Supporter NFT (ERC721) to the tipper.
contract CreatorTip is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    address public openActionAddress;

    event Tipped(address indexed creator, address indexed tipper, uint256 amount, address token);
    event SupporterNFTMinted(address indexed tipper, uint256 tokenId, string tokenURI);

    constructor(address _openActionAddress) ERC721("CreatorTip Supporter", "CTS") {
        openActionAddress = _openActionAddress;
    }

    modifier onlyOpenAction() {
        require(msg.sender == openActionAddress, "CreatorTip: caller is not authorized Open Action");
        _;
    }

    /**
     * @dev Tip a creator in MATIC (native) or ERC20 token, then mint a Supporter NFT to the tipper.
     * @param creator Recipient address of tip.
     * @param amount Amount of token to tip.
     * @param token Address of ERC20 token, or address(0) for MATIC.
     * @param metadataURI IPFS URI or metadata URI for the Supporter NFT.
     */
    function tip(
        address creator,
        uint256 amount,
        address token,
        string calldata metadataURI
    ) external payable onlyOpenAction {
        address tipper = tx.origin;

        if (token == address(0)) {
            require(msg.value == amount, "CreatorTip: incorrect MATIC amount");
            payable(creator).transfer(amount);
        } else {
            // Transfer ERC20 from tipper to creator. Tip amount must be approved by tipper for this contract.
            IERC20(token).transferFrom(tipper, creator, amount);
        }

        emit Tipped(creator, tipper, amount, token);
        _mintSupporterNFT(tipper, metadataURI);
    }

    /**
     * @dev Internal: mints a new ERC721 token to the tipper with given metadata URI.
     */
    function _mintSupporterNFT(address to, string calldata metadataURI) internal {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);

        emit SupporterNFTMinted(to, tokenId, metadataURI);
        _tokenIdCounter++;
    }

    /** @dev Allow owner to update Open Action address (backend) if needed. */
    function setOpenActionAddress(address newAddress) external onlyOwner {
        openActionAddress = newAddress;
    }
} 