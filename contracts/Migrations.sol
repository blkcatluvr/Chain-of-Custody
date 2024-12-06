/*
/**
 * # This function was generated with assistance from ChatGPT, an AI tool developed by OpenAI.
# Reference: OpenAI. (2024). ChatGPT [Large language model]. openai.com/chatgpt
 */ 
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.6.0;

contract Migrations {
  address public owner = msg.sender;
  uint public last_completed_migration;

  modifier restricted() {
    require(
      msg.sender == owner,
      "This function is restricted to the contract's owner"
    );
    _;
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }
  struct Block {
        bytes32 previousHash;
        uint64 timeStamp;
        bytes32 caseID;
        bytes32 itemID;
        bytes12 state;
        bytes12 creator;
        bytes12 owner; 
        uint32 length;
        string data;
    }


    event LogString(bytes32 message);
    mapping(bytes32 => bool) private validPasswordHashes;
    mapping(bytes12 => bool) private validReasons;

    uint public blockCount = 0;
    mapping(uint => Block) public blocks;
    
    mapping(bytes32 => bool) public caseIDExists;
    mapping(bytes32 => bool) public itemIDExists;
    mapping(bytes32 => Block) public itemList;
    mapping(bytes32 => bool) public checkedIn;
    mapping(bytes32 => bool) public isRemoved;
    mapping(uint => bytes32) public itemName;

    constructor() public{
        // Initialize the mapping with valid password hashes
        validPasswordHashes[keccak256(abi.encodePacked("L76L"))] = true;
        validPasswordHashes[keccak256(abi.encodePacked("P80P"))] = true;
        validPasswordHashes[keccak256(abi.encodePacked("A65A"))] = true;
        validPasswordHashes[keccak256(abi.encodePacked("E69E"))] = true;
        validPasswordHashes[keccak256(abi.encodePacked("C67C"))] = true;
        validReasons[bytes12("DISPOSED")] = true; validReasons[bytes12("DESTROYED")] = true;
        validReasons[bytes12("RELEASED")] = true;
    }
    function init() public{
      require(blockCount == 0, "Blockchain file found with INITIAL block.");
      blocks[blockCount] = Block(bytes32(0),0,bytes32(0),bytes32(0),"INITIAL",bytes12(0),bytes12(0),14,"Initial block" );
      blockCount++;    
    }
    function validPassword(string memory password) public pure returns (bool) {
        return keccak256(abi.encodePacked(password)) == keccak256(abi.encodePacked("C67C"));
    }
    function validPasswords(string memory password) public view returns (bool) {
        return validPasswordHashes[keccak256(abi.encodePacked(password))];
    }
    function getBlockHash(Block memory blockData) internal pure returns (bytes32) {
    return keccak256(
        abi.encodePacked(
            blockData.previousHash,
            blockData.timeStamp,
            blockData.caseID,
            blockData.itemID,
            blockData.state,
            blockData.creator,
            blockData.owner,
            blockData.length,
            blockData.data
        )
    );
  }
    function add(bytes32 case_id, bytes32[] memory item_ids, bytes12 creator, string memory password) public {
        //require(!caseIDExists[case_id], "> Case ID already exists!");
        require(keccak256(abi.encodePacked(password)) == keccak256(abi.encodePacked("C67C")), "> Invalid password");
        for (uint i = 0; i < item_ids.length; i++) {
          require(!isRemoved[item_ids[i]], "> Attempting to add item that has been removed");
          require(!itemIDExists[item_ids[i]], "Attempting to add item that exist");
        }
        for (uint i = 0; i < item_ids.length; i++) {
          if(!itemIDExists[item_ids[i]]){
            blocks[blockCount] = Block(
                 blockCount == 0 ? bytes32(0) : getBlockHash(blocks[blockCount - 1]),
                 uint64(block.timestamp),
                 case_id,
                 item_ids[i],
                 "CHECKEDIN",
                 creator,
                 bytes12(0), // Set the owner to a default value for now
                 uint32(bytes("Item added").length),
                 "Item added" // Placeholder data
            );
            blockCount++;
            itemIDExists[item_ids[i]] = true; 
            checkedIn[item_ids[i]] = true;
            isRemoved[item_ids[i]] = false;
            itemList[item_ids[i]] = blocks[blockCount];
          }
        }
        //caseIDExists[case_id] = true;
  }
  function checkout(bytes32 itemID, string memory password) public {
      require(itemIDExists[itemID], "Item ID does not exist"); 
      require(validPasswordHashes[keccak256(abi.encodePacked(password))], "Invalid password");
      require(checkedIn[itemID], "Item is not in a CHECKEDIN state");
      require(!isRemoved[itemID], "Item has already been removed");

      // Create a new block for the checkout action
      blocks[blockCount] = Block({
          previousHash: blockCount == 0 ? bytes32(0) : getBlockHash(blocks[blockCount - 1]),
          timeStamp: uint64(block.timestamp),
          caseID: itemList[itemID].caseID, // Reference the associated case ID
          itemID: itemID,
          state: "CHECKEDOUT",
          creator: itemList[itemID].creator, // Actor performing the checkout
          owner: itemList[itemID].owner, // Retain the current owner
          length: uint32(bytes("Checked out").length),
          data: "Checked out" // Description of the action
      });
      blockCount++;
      checkedIn[itemID] = false;
  }
  function checkin(bytes32 itemID, string memory password) public {
      require(itemIDExists[itemID], "Item ID does not exist");
      require(validPasswordHashes[keccak256(abi.encodePacked(password))], "Invalid password");
      require(!checkedIn[itemID], "Item is already in a CHECKEDIN state");
      require(!isRemoved[itemID], "Item has already been removed");

      // Create a new block for the checkout action
      blocks[blockCount] = Block({
          previousHash: blockCount == 0 ? bytes32(0) : getBlockHash(blocks[blockCount - 1]),
          timeStamp: uint64(block.timestamp),
          caseID: itemList[itemID].caseID, // Reference the associated case ID
          itemID: itemID,
          state: "CHECKEDIN",
          creator:itemList[itemID].creator, // Actor performing the checkout
          owner: itemList[itemID].owner, // Retain the current owner
          length: uint32(bytes("Checked out").length),
          data: "Checked out" // Description of the action
      });
      blockCount++;
      checkedIn[itemID] = true; 
  }
  function remove(bytes32 itemID, bytes12 state, string memory password) public{
      require(itemIDExists[itemID], "Item ID does not exist");
      require(keccak256(abi.encodePacked(password)) == keccak256(abi.encodePacked("C67C")), "Invalid password");
      require(checkedIn[itemID], "Item is not CHECKIN");
      require(validReasons[state], "Reason is not valid");
      require(!isRemoved[itemID], "Item has already been removed");
  
      blocks[blockCount] = Block({
          previousHash: blockCount == 0 ? bytes32(0) : getBlockHash(blocks[blockCount - 1]),
          timeStamp: uint64(block.timestamp),
          caseID: itemList[itemID].caseID, // Reference the associated case ID
          itemID: itemID,
          state: state,
          creator:itemList[itemID].creator, // Actor performing the checkout
          owner: itemList[itemID].owner, // Retain the current owner
          length: uint32(bytes("Checked out").length),
          data: "Checked out" // Description of the action
      });
      blockCount++;
      isRemoved[itemID] = true;
  }
function verify() public view returns (bool) {
    // If there are no blocks or only the initial block, the chain is valid
    if (blockCount <= 2) {
        return (true);
    }

    for (uint i = 2; i < blockCount; i++) {
        // Calculate the hash of the previous block
        bytes32 calculatedPreviousHash = getBlockHash(blocks[i - 1]);
        if (blocks[i].previousHash != calculatedPreviousHash) {
            return (false);
        }
    }

    return (true);
}

}
