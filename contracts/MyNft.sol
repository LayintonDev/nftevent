// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract MyNft is ERC721 {
    uint private token_counter;
    string imgUri;

    constructor() ERC721("MYNFT", "MNFT") {
        token_counter = 0;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function mint(string memory _imgUri) external {
        imgUri = _imgUri;
        token_counter++;
        _safeMint(msg.sender, token_counter);
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name": "MYNFT", "description": "Layinton On Chain My NFT", "image": "',
                                imgUri,
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}
