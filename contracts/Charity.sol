pragma experimental ABIEncoderV2;


library CharityLib{
    struct Charity{
        address[] donatorsAddress;
        string[] donatorsNames;
        address[] voters;
        uint256 requiredAmount;
        uint256 collectedAmount;
        string charityName;
        string description;
        address payable charityAddress;
        uint256 dueDate;
        bool isOpen;
    }
}


contract NGO{
    struct Request{
        address payable addr;
        uint256 requestedAmount;
        uint256 sendAmount;
        bool isComplete;
    }

    CharityLib.Charity[] public charityList;
    Request[] public requestList;
    //Admin can't be payable so we create a wallet.
    address admin;
    address payable wallet;
    mapping(address => bool) donator;
    uint8 tax_percent = 1;
    uint256 public ngo_amount = 0;
    string NGO_name;

    constructor(address payable addr, string memory name)public{
        admin = msg.sender;
        wallet = addr;
        NGO_name = name;
    }

    modifier onlyAdmin {
        require(msg.sender==admin);
        _;
    }

    modifier authenticateTransaction{
        require(donator[msg.sender]);
        _;
    }

    function updateCharity(uint256 i) internal {
        if (charityList[i].requiredAmount - charityList[i].collectedAmount == 0 ||
            charityList[i].dueDate < block.timestamp) {
                charityList[i].isOpen = false;
            }
    }

    event DonationEvent(
        CharityLib.Charity charity,
        address donator,
        uint256 amount
    );

    function getTaxPercent() public view authenticateTransaction returns(uint8) {
        return tax_percent;
    }


    function authenticateDonator(address donatorAddress) 
    public 
    onlyAdmin
    {
        donator[donatorAddress] = true;
    }

    function closeAllExpired() 
    public 
    {
        for(uint256 i=0;i<charityList.length;++i) {
            updateCharity(i);
        }
    }

    function verify(CharityLib.Charity memory charity) internal pure returns(bool)
    {
        if( charity.requiredAmount>0 && charity.dueDate>0)
         return true;
        else 
         return false;
    }

    function addCharity(string memory charity,string memory description,uint256 amount,address payable addr,uint256 daysOpen) 
    public 
    onlyAdmin
    {
        address[] memory tempDonors;
        string[] memory tempNames;
        address[] memory tempAddresses;

        CharityLib.Charity memory _temp = CharityLib.Charity(tempDonors,tempNames,tempAddresses,
        amount,0,charity,description,addr,block.timestamp + daysOpen*86400,true);
        bool flag = verify(_temp);
        require(flag);
        charityList.push(_temp);
    }

    function RequestMoney(address payable _addr, uint256 _amount) public {
        requestList.push(Request(_addr,_amount,0,false));
    }

    function donateToRequest(uint256 id) public payable onlyAdmin{
        if( (requestList[id].requestedAmount - requestList[id].sendAmount) - msg.value >= 0 && ! requestList[id].isComplete){
            requestList[id].addr.transfer(msg.value);
            requestList[id].sendAmount+=msg.value;
            if(  requestList[id].requestedAmount - requestList[id].sendAmount == 0 )
            requestList[id].isComplete = true;
        }

    }

    function removeCharity(uint256 _id)
    public 
    onlyAdmin
    {

        charityList[_id].isOpen = false;
    }

    function numberOfOpenChairites() 
    public
    view
    returns(uint256)
    {
      uint256 count=0;
      for(uint256 i=0;i<charityList.length;++i) {
            if (charityList[i].isOpen) {
                ++count;
            }
        }
        return count;
    }

    function getWallet() 
    public
    view
    returns(address payable)
    {
        return wallet;
    }


    function vote(uint256 id) public authenticateTransaction{
        _vote(id,tx.origin);

    }


    function _vote(uint256  id, address  voterAddress) internal {
        for(uint256 i=0;i<charityList[id].voters.length;++i){
            if(charityList[id].voters[i] == voterAddress)
            return;
        }
        charityList[id].voters.push(voterAddress);
    }

    function contributeToCharity(uint charityIndex,string calldata name,uint256 value) external authenticateTransaction {
        require(charityList[charityIndex].isOpen);
        require((charityList[charityIndex].requiredAmount - charityList[charityIndex].collectedAmount) - value >= 0);
        charityList[charityIndex].collectedAmount += value;
        _vote(charityIndex,tx.origin);
        updateCharity(charityIndex);
        charityList[charityIndex].donatorsAddress.push(tx.origin);
        charityList[charityIndex].donatorsNames.push(name);
        emit DonationEvent(charityList[charityIndex],tx.origin,value);
  }

    function viewRating(uint256 id) public view returns(uint256 ){
        return(charityList[id].voters.length);

    }

    function viewDonators(uint256 id) public view returns (string[] memory, address[] memory){
        return(charityList[id].donatorsNames,charityList[id].donatorsAddress);
    }


    function getCharityAddress(uint256 id) 
    external
    view
    authenticateTransaction
    returns(address payable)
    {
        return charityList[id].charityAddress;
    }

    function viewCharity(uint256 id) 
    public
    view
    returns(string memory,string memory ,string memory ,address,string memory,uint256,string memory,uint256,uint256)
    {
        return( charityList[id].charityName,
                charityList[id].description,
                "Address:",
                charityList[id].charityAddress,
                "Due date:",
                charityList[id].dueDate,
                "Amount",
                charityList[id].collectedAmount,
                charityList[id].requiredAmount);

    }

    function donateToNGO(uint256 amount) public authenticateTransaction {
        ngo_amount += amount;
    }

    function sort_array(CharityLib.Charity[] memory arr_) private pure returns (uint[] memory)
    {
        uint256 l = arr_.length;
        CharityLib.Charity[] memory arr = new CharityLib.Charity[] (l);
        uint[] memory indexes = new uint[] (l);

        for(uint i=0;i<l;i++)
        {
            arr[i] = arr_[i];
            indexes[i] = i;
        }

        for(uint i =0;i<l;i++)
        {
            for(uint j =i+1;j<l;j++)
            {
                if(arr[i].voters.length<arr[j].voters.length)
                {
                    CharityLib.Charity memory temp= arr[j];
                    arr[j]=arr[i];
                    arr[i] = temp;

                    uint tempIndex = j;
                    indexes[j] = indexes[i];
                    indexes[i] = tempIndex;

                }

            }
        }
        return indexes;
    }

    function min(uint a, uint b) private pure returns(uint) {
        return a <= b ? a : b;
    }

    function donateToBestCharities(uint donate_to)
    public
    payable
    onlyAdmin
    {
        uint[] memory indexes = sort_array(charityList);
        donate_to = min(donate_to,charityList.length);
        uint256 donation_amount = ((ngo_amount * 85)/100) / donate_to;

        for(uint i=0;i<donate_to;++i) {
            charityList[indexes[i]].charityAddress.transfer(donation_amount);
            charityList[indexes[i]].collectedAmount += donation_amount;
            _vote(indexes[i],wallet);
            charityList[indexes[i]].donatorsAddress.push(wallet);
            charityList[indexes[i]].donatorsNames.push(NGO_name);
            emit DonationEvent(charityList[indexes[i]],wallet,donation_amount);
            ngo_amount -= donation_amount;
            closeAllExpired();
        }
    }
}

contract Donation {
    NGO ngo;

    constructor(NGO _ngo)public{
        ngo = _ngo;
    }

    function donateToCharity(uint index,string memory name) public payable{
        uint8 tax_percent = ngo.getTaxPercent();
        uint256 for_NGO = (msg.value * tax_percent)/100;
        uint256 for_charity = msg.value - for_NGO;
        require(for_charity > 0 && for_charity > 0);
        ngo.getCharityAddress(index).transfer(for_charity);
        ngo.contributeToCharity(index,name,for_charity);
        ngo.getWallet().transfer(for_NGO);
        ngo.donateToNGO(for_NGO);
    }

    function donateToNGO() public payable {
        ngo.getWallet().transfer(msg.value);
    }

    function vote(uint256 id) public{
        ngo.vote(id);
    }

    function viewCharity(uint256 id) 
    public
    view
    returns(string memory,string memory ,string memory ,address,string memory,uint256,string memory,uint256,uint256)
    {
        return ngo.viewCharity(id);
    }

    function viewRating(uint256 id) 
    public
    view
    returns(uint256 )
    {
        return ngo.viewRating(id);
    }
}

contract Receive{
    string public charityName;
    string public description;
    uint256 public requiredAmount;
    uint256 public collectedAmount;
    address payable public charityAddress;
    uint256 public dueDate;
    bool public isOpen;

    constructor(string memory name,string memory _description,uint256 amount,address payable addr,uint256 daysOpen)public{
        requiredAmount = amount;
        collectedAmount = 0 ;
        charityName = name;
        description = _description;
        charityAddress = addr;
        dueDate = block.timestamp + daysOpen*86400;
        isOpen = true;
    }

    modifier restrict {
        require(msg.sender == charityAddress);
        _;
    }

    function donate() public payable {
        require(isOpen);
        require((requiredAmount - collectedAmount) - msg.value >= 0);
        collectedAmount += msg.value;
        charityAddress.transfer(msg.value);
        updateCharity();

    }

    function updateCharity() internal {
        if (requiredAmount - collectedAmount == 0 ||
            dueDate < block.timestamp) {
                isOpen = false;

            }
    }
}

contract CharityFactory {

    uint256 public cnt;
    mapping(uint256 => Receive) public charities;

    constructor ()public { 
        cnt = 0;
    }

    function newCharity(string memory name,string memory description,uint256 amount,address payable addr,uint256 daysOpen) public returns (address newCar) {
        Receive charity = (new Receive(name, description,amount, addr, daysOpen));
        charities[cnt] = charity;
        cnt++;
        return address(charity);
    }

    function getNthCharityName(uint256 n) public view returns(string memory) {
        return charities[n].charityName();
    }

    function getNthCharityAddress(uint256 n) public view returns(address payable) {
        return charities[n].charityAddress();
    }

    function getNthCharity(uint256 n) public view returns(Receive) {
        return charities[n];
    }

    function donateNthCharity(uint256 n) public payable {
        charities[n].donate();
    }
}