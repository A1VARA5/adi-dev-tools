// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title NFT
 * @notice Simple ERC-721 collection for the nft-mint example dApp.
 *         ADI Chain's low fees make NFT minting practical at scale.
 *
 * @dev Minimal ERC-721 — no external dependencies.
 *      For production use the ADINFT.sol template from the adi-devtools/contracts
 *      package, which includes URI storage, operator approvals, and more admin controls.
 *
 * Deploy:
 *   forge script script/NFT.s.sol \
 *     --rpc-url https://rpc.ab.testnet.adifoundation.ai \
 *     --broadcast \
 *     --private-key $TESTNET_PRIVATE_KEY
 */
contract NFT {
    // ─── State ────────────────────────────────────────────────────────────────

    string public name;
    string public symbol;
    string public baseTokenURI;

    address public immutable owner;
    uint256 private _tokenIdCounter;

    uint256 public immutable maxSupply;
    uint256 public mintPrice; // in ADI (wei). 0 = free mint
    bool public mintingOpen;

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // ─── Events ───────────────────────────────────────────────────────────────

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner_, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner_, address indexed operator, bool approved);
    event Minted(address indexed to, uint256 indexed tokenId);

    // ─── Errors ───────────────────────────────────────────────────────────────

    error Unauthorized();
    error TokenDoesNotExist();
    error MintingClosed();
    error MaxSupplyReached();
    error InsufficientPayment();
    error TransferToZeroAddress();
    error NotOwnerNorApproved();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseTokenURI,
        uint256 _maxSupply,
        uint256 _mintPrice
    ) {
        name       = _name;
        symbol     = _symbol;
        baseTokenURI = _baseTokenURI;
        maxSupply  = _maxSupply;
        mintPrice  = _mintPrice;
        owner      = msg.sender;
        mintingOpen = true;
    }

    // ─── ERC-721 Core ─────────────────────────────────────────────────────────

    function totalSupply() external view returns (uint256) { return _tokenIdCounter; }
    function balanceOf(address account) external view returns (uint256) { return _balances[account]; }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address tokenOwner = _owners[tokenId];
        if (tokenOwner == address(0)) revert TokenDoesNotExist();
        return tokenOwner;
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        ownerOf(tokenId);
        return string(abi.encodePacked(baseTokenURI, _toString(tokenId)));
    }

    function approve(address to, uint256 tokenId) external {
        address tokenOwner = ownerOf(tokenId);
        if (msg.sender != tokenOwner && !_operatorApprovals[tokenOwner][msg.sender])
            revert NotOwnerNorApproved();
        _tokenApprovals[tokenId] = to;
        emit Approval(tokenOwner, to, tokenId);
    }

    function getApproved(uint256 tokenId) external view returns (address) {
        ownerOf(tokenId);
        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) external {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address account, address operator) external view returns (bool) {
        return _operatorApprovals[account][operator];
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        if (to == address(0)) revert TransferToZeroAddress();
        address tokenOwner = ownerOf(tokenId);
        if (
            msg.sender != tokenOwner &&
            msg.sender != _tokenApprovals[tokenId] &&
            !_operatorApprovals[tokenOwner][msg.sender]
        ) revert NotOwnerNorApproved();
        delete _tokenApprovals[tokenId];
        _balances[from]--;
        _balances[to]++;
        _owners[tokenId] = to;
        emit Transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) external {
        transferFrom(from, to, tokenId);
    }

    // ─── Minting ──────────────────────────────────────────────────────────────

    /// @notice Public mint — caller receives the token. Payable if mintPrice > 0.
    function mint() external payable returns (uint256 tokenId) {
        if (!mintingOpen) revert MintingClosed();
        if (_tokenIdCounter >= maxSupply) revert MaxSupplyReached();
        if (msg.value < mintPrice) revert InsufficientPayment();
        return _mint(msg.sender);
    }

    /// @notice Owner can airdrop tokens to any address for free.
    function mintTo(address to, uint256 quantity) external onlyOwner {
        for (uint256 i = 0; i < quantity; i++) {
            if (_tokenIdCounter >= maxSupply) revert MaxSupplyReached();
            _mint(to);
        }
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    function setMintingOpen(bool _open)             external onlyOwner { mintingOpen = _open; }
    function setMintPrice(uint256 _price)           external onlyOwner { mintPrice = _price; }
    function setBaseURI(string calldata _uri)       external onlyOwner { baseTokenURI = _uri; }

    function withdraw() external onlyOwner {
        (bool ok, ) = owner.call{value: address(this).balance}("");
        require(ok, "Withdraw failed");
    }

    // ─── Internal ─────────────────────────────────────────────────────────────

    function _mint(address to) internal returns (uint256 tokenId) {
        tokenId = ++_tokenIdCounter;
        _balances[to]++;
        _owners[tokenId] = to;
        emit Transfer(address(0), to, tokenId);
        emit Minted(to, tokenId);
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        // forge-lint: disable-next-line(unsafe-typecast)
        while (value != 0) { digits--; buffer[digits] = bytes1(uint8(48 + value % 10)); value /= 10; }
        return string(buffer);
    }
}
