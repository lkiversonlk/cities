pragma solidity ^0.4.20;

contract ERC721 {
    // Required methods
    function totalSupply() public view returns (uint256 total);
    function balanceOf(address _owner) public view returns (uint256 balance);
    function ownerOf(uint256 _tokenId) public view returns (address owner);
    function approve(address _to, uint256 _tokenId) external;
    function transfer(address _to, uint256 _tokenId) public;
    function transferFrom(address _from, address _to, uint256 _tokenId) public;

    // Events
    event Transfer(address from, address to, uint256 tokenId);
    event Approval(address owner, address approved, uint256 tokenId);
}

contract AmoebaControl {
    address public owner;    
    address public admin;
    
    bool public paused = false;

    function AmoebaControl() public {
        owner = msg.sender;
        admin = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }
    
    modifier whenPaused() {
        require(paused);
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused);
        _;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }

    function pause() external onlyOwner whenNotPaused {
        paused = true;
    }
    
    function unpause() external onlyOwner whenPaused {
        paused = false;
    }
    
    function setAdmin(address _admin) external onlyOwner {
        admin = _admin;
    }
}

/**
 * AmoebaBase
 * store the data,
 * provide the basic function
 */
contract AmoebaBase is AmoebaControl {

    /**************** Data **********************************************************/
    
    /**
     *   owner of Position
     *   last sold price of position
     */
    struct Position {
        address owner;
        uint256 price;
        uint256 cooldown;
        uint256 gen;
    }

    mapping (uint256 => Position) public positions;
    mapping (uint256 => address) public approved;
    mapping (address => uint256[]) public owned;

    /**************** events **********************************************************/
    /// new position comes to the map
    event NewToken(address owner, uint256 id);
    /// ownership transfer, only on sell
    event Transfer(address from, address to, uint256 id);

    /**************** modifier **********************************************************/
    modifier tokenOwner(uint256 id) {
        require(positions[id].owner == msg.sender);
        _;
    }
    
    modifier notOwned(uint256 i) {
        require(positions[i].owner == address(0));
        _;
    }

    /**************** function **********************************************************/

    /**
     * consider use binary search
     */ 
    function _transfer(address _from, address _to, uint256 _pos_id) internal {
        //update ownership
        require(positions[_pos_id].owner != _to);
        positions[_pos_id].owner = _to;
        
        owned[_to].push(_pos_id);

        /*
        //remove from prev owner's stats
        // if transfer from owner to contract, which means the token is on selling, doesn't remove it from previous owner
        // if (_from != address(0) && _from != address(this) && _to != address(this)) {
        */
        if (_from != address(0)) {
            uint256 i = 0;
            for(; i < owned[_from].length; i ++) {
                if (owned[_from][i] == _pos_id) {
                    break;
                }
            }
            if(i < owned[_from].length) {
                owned[_from][i] = owned[_from][owned[_from].length - 1];
                owned[_from].length = owned[_from].length - 1;
            }
        }
        
        //clear approved info
        delete approved[_pos_id];
        
        //events
        Transfer(_from, _to, _pos_id);
    }

    function _approve(uint256 _pos_id, address _to) internal {
        approved[_pos_id] = _to;
    }

    function _createToken(
        uint256 _id,
        address _to,
        uint256 _price,
        uint256 _gen,
        uint256 _cooldown
    ) internal
    {
        //not allow repeat creation
        require(positions[_id].owner == address(0));
        _transfer(0, _to, _id);
        positions[_id].price = _price;
        positions[_id].cooldown = _cooldown;
        positions[_id].gen = _gen;
        //events
        NewToken(_to, _id);
    }
}

/**
 * anyToken is a (lat, lon, lv) combination
 * 
 * example:
 *        maxLv 3
 *        then (23.1, 120.1, 1) means a lv1 token (23.1, 120.1) => id 2310012010000 
 *             (23.1, 120,1, 2) means a lv2 token (23.10, 120.10) => id 2310012010001
 */ 
contract GeoAmoeba is AmoebaBase, ERC721{
    /**************** data **********************************************************/
    string public constant name = "Amoeba";
    string public constant symbol = "AMB";
    
    uint256 public lonOffset;        // default = 10 ** 2
    uint256 public latOffset;        // default = 10 ** (2 + 3 + maxLv)
    uint256 public maxLv;             
    uint256 public maxLon;
    uint256 public maxLat;

    /**************** events **********************************************************/

    /**************** modifier **********************************************************/
    modifier validLongitude(uint256 lon, uint256 lv) {
        require(0 <= lon && lon < maxLon);
        require((lon % (10 ** (maxLv - lv - 1))) == 0);
        
        _;
    }
    
    modifier validLatitude(uint256 lat, uint256 lv) {
        require(0 <= lat && lat < maxLat);
        require((lat % (10 ** (maxLv - lv - 1))) == 0);
        
        _;
    }
    
    modifier validLv(uint256 lv) {
        require(0 <= lv && lv < maxLv);
        _;
    }
    
    modifier validMaxLv(uint256 lv) {
        require(1 <= lv && lv < 100);
        _;
    }
    
    /**************** functions **********************************************************/
    function _owned(uint256 i) internal view returns (bool) {
        if(positions[i].owner == address(0)) {
            return false;
        } else {
            return true;
        }
    }

    ////////////      ERC 721   //////////////////
    function totalSupply() public view returns (uint256) {
        uint256 total = 0;
        for(uint i = 0; i < maxLv; i ++) {
            total += 360 * (10 ** i) * 180 * (10 ** i);
        }
        return total;
    }

    function balanceOf(address _owner) public view returns (uint256 count) {
        return owned[_owner].length;
    }

    function ownerOf(uint256 _id) public view returns (address owner)
    {
        return positions[_id].owner;
    }

    function approve(
        address _to,
        uint256 _pos_id
    ) external tokenOwner(_pos_id)
    {
        _approve(_pos_id, _to);
    }

    function transfer(address _to, uint256 _pos_id) public tokenOwner(_pos_id)
    {
        revert();
    }
  
    function transferFrom(address _from, address _to, uint256 _id) public 
    {
        revert();
    }
    
    RandSource public randSource;
    
    /**
     * construct with specified lv
     * 
     * GeoAmoeba(2, 2) means
     *     tokens have two levels (lon.x, lat.y) and (lon, lat)
     *     the id will be like  %3d(lon)%1d(x||0)%3d(lat)%1d(y||0)%2d(level)
     *     so latOffset is 2, lonOffset is 2 + 3 + 1 = 6;
     * GeoAmoeba(4, 2) means
     *     tokens have 4 levels
     *     id is like           %3d(lon)%3d(x||0)%3d(lat)%3d(y||0)%2d(level)
     */
    function GeoAmoeba(uint256 lv) public validMaxLv(lv) {
        maxLv = lv;
        lonOffset = 10 ** 2;
        latOffset = lonOffset * 10 ** (3 + lv);
        maxLon = 360 * (10 ** lv);
        maxLat = 180 * (10 ** lv);
    }
    
    /**
     * [150.230, 34.210, 1] => 15023003421001
     * 
     */ 
    function _fromLatLon(uint256 _lat, uint256 _lon, uint256 lv) 
    internal view
    validLv(lv) validLongitude(_lon, lv) validLatitude(_lat, lv)
    returns (uint256) {
        return _lon * lonOffset + _lat * latOffset + lv;
    }
    
    function _fromId(uint256 id) internal view
    returns (uint256, uint256, uint256) {
        uint256 lv = id % lonOffset;
        uint256 lon = id % latOffset / lonOffset;
        uint256 lat = id / latOffset;
        
        require(0 <= lv && lv < maxLv);
        
        require(0 <= lon && lon < maxLon);
        require(lon % (10 ** (maxLv - lv - 1)) == 0);
        
        require(0 <= lat && lat < maxLat);
        require(lat % (10 ** (maxLv - lv - 1)) == 0);
        
        return (lat, lon, lv);
    }
    
    function _rand() internal view returns (uint256) {
        return uint256(keccak256(block.number, block.difficulty, msg.data));
    }
    
    function _available(uint256 i) internal view returns (uint256[], uint256) {
        uint256 lon;
        uint256 lat;
        uint256 lv;
        
        (lat, lon, lv) = _fromId(i);
        
        uint256 lonL = (lon + maxLon - 10 ** (maxLv - lv - 1)) % maxLon;
        uint256 lonR = (lon + 10 ** (maxLv - lv - 1)) % maxLon;
        
        uint256[] memory ret = new uint256[](8);
        uint j = 0;
        uint256 tmp;
        if (lat >= (10 ** (maxLv - lv - 1))) {
            uint256 latN = (lat - 10 ** (maxLv - lv - 1));
            tmp = _fromLatLon(latN, lonL, lv);
            if (!_owned(tmp)) {
                ret[j++] = tmp;
            }
            
            tmp = _fromLatLon(latN, lon, lv);
            if (!_owned(tmp)) {
                ret[j++] = tmp;
            }

            tmp = _fromLatLon(latN, lonR, lv);
            if (!_owned(tmp)) {
                ret[j++] = tmp;
            }
        }
        
        tmp = _fromLatLon(lat, lonL, lv);
        if (!_owned(tmp)) {
            ret[j++] = tmp;
        }

        tmp = _fromLatLon(lat, lonR, lv);
        if (!_owned(tmp)) {
            ret[j++] = tmp;
        }
        
        if (lat < maxLat - (10 ** (maxLv - lv - 1))){
            uint256 latS = lat + 10 ** (maxLv - lv - 1);
            tmp = _fromLatLon(latS, lonL, lv);
            if (!_owned(tmp)) {
                ret[j++] = tmp;
            }

            tmp = _fromLatLon(latS, lon, lv);
            if (!_owned(tmp)) {
                ret[j++] = tmp;
            }

            tmp = _fromLatLon(latS, lonR, lv);
            if (!_owned(tmp)) {
                ret[j++] = tmp;
            }
        }
        return (ret, j);
    }

    function available(uint256 i) public view returns (uint256[]) {
        uint256[] memory _ava;
        uint256 len;
        (_ava, len) = _available(i);
        
        uint256[] memory ret = new uint256[](len);
        
        uint k = 0;
        for(uint j = 0; j < len; j ++) {
            if (positions[_ava[j]].owner == address(0)){
                ret[k++] = _ava[j];
            }
        }
        return ret;
    }
    
    function upTokens(uint256 i) public view returns (uint256[]) {
        uint256 lon; 
        uint256 lat;
        uint256 lv;
        
        (lat, lon, lv) = _fromId(i);
        
        if (lv == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory ups = new uint256[](1);
            uint256 lonU = lon - lon % (10 ** (maxLv - lv));
            uint256 latU = lat - lat % (10 ** (maxLv - lv));
            ups[0] = _fromLatLon(latU, lonU, lv - 1);
            return ups;
        }
    }
}

contract AuctionAmoeba is GeoAmoeba {
    
    /**************** data **********************************************************/
    struct Auction {
        address seller;
        uint256 startPrice;
        uint256 endPrice;
        uint256 duration;
        uint256 startAt;
        bool    biddable;
    }
    
    mapping(address=>uint256) public earned;
    
    enum Stage {
        INITIAL,
        ONSELL,
        OWNED
    }
    
    uint256 public ownerCut;
    uint256 public bidFloor;
    uint256[] public cooldown = [
        0,
        1 minutes,
        1 hours,
        1 days,
        3 days
    ];

    mapping (uint256 => Auction) public auctions;
    
    /**************** events **********************************************************/
    event AuctionCreated(uint256 id, uint256 startPrice, uint256 endPrice, uint256 duration);
    event AuctionSuccessful(uint256 id, uint256 price, address winner);
    event AuctionCancelled(uint256 id);
    
    /**************** modifier **********************************************************/
    
    modifier onStage(uint256 i, Stage stage) {
        require(getStage(i) == stage);
        _;
    }
    
    /**************** functions **********************************************************/
    function AuctionAmoeba(uint256 lv, uint256 fee, uint256 _bidFloor) public
    GeoAmoeba(lv)
    {
        ownerCut = fee;
        bidFloor = _bidFloor;
    }

    function _genCooldown(uint256 gen) internal view returns (uint256) {
        if (gen < cooldown.length) {
            return cooldown[gen];
        } else {
            return cooldown[cooldown.length - 1];
        }
    }

    function getStage(uint256 i) public view returns (Stage) {
        if (ownerOf(i) == 0) {
            return Stage.INITIAL;
        }
        if (auctions[i].biddable) {
            return Stage.ONSELL;
        }
        return Stage.OWNED;
    }
    
    function _owns(address _owner, uint256 _id) internal view returns (bool) {
        return positions[_id].owner == _owner;
    }

    function _escrow(address _owner, uint256 _id) internal {
        transferFrom(_owner, this, _id);
    }

    // cancel won't delete the auction
    // if owner opened auction again he'll use the same auction data, so he can't stop price falling
    function _cancelAuction(uint256 _id) internal {
        // delete auctions[_id];
        // transfer(_seller, _id);
        auctions[_id].biddable = false;
        
        AuctionCancelled(_id);
    }

    function currentPrice(uint256 i) public view returns (uint256)
    {
        Auction memory _auction = auctions[i];
        uint256 secondsPassed = 0;
        if(now > _auction.startAt) {
            secondsPassed = now - _auction.startAt;
        }

        uint256 ret = _computeCurrentPrice(
            _auction.startPrice,
            _auction.endPrice,
            _auction.duration,
            secondsPassed
        );
        if (ret < bidFloor) {
            ret = bidFloor;
        }
        return ret;
    }

    function _computeCurrentPrice(
        uint256 _startPrice,
        uint256 _endPrice,
        uint256 _duration,
        uint256 _secondsPassed
    ) internal pure returns (uint256) {
        if (_secondsPassed > _duration) {
            return _endPrice;
        } else {
            int256 _priceRange = int256(_endPrice) - int256(_startPrice);
            
            int256 _passedDays = int256(_secondsPassed) / 10; //86400;
            int256 _durationDays = int256(_duration) / 10; //86400;
            
            int256 _priceChange = _priceRange * _passedDays / _durationDays;
            int256 cp = int256(_startPrice) + int256(_priceChange);
            return uint256(cp);
        }
    }

    function _createAuction(uint256 i, uint256 _start, uint256 _end, uint256 _duration, address seller) internal {
        require(_start == uint256(uint128(_start)));
        require(_end == uint256(uint128(_end)));
        require(_duration == uint256(uint64(_duration))); 
        
        auctions[i].biddable = true;
        
        //we do not allow repeat auction on same token before the former ended
        //there is already auction, just restart it
        if (auctions[i].seller != address(0)) {
            return;
        }
        
        auctions[i].seller = seller;
        auctions[i].startPrice = _start;
        auctions[i].endPrice = _end;
        auctions[i].duration = _duration;
        auctions[i].startAt = uint256(now);
        
        AuctionCreated(i, _start, _end, _duration);
    }
    
    /**
     * bid on token,
     * the contract owner get ownerCut%
     * each up lv token of the token get 1%
     * the seller gets the remain
     * return the final price
     */
    function _bid(uint256 i, uint256 value) internal returns (uint256) {
        uint256 price = currentPrice(i);
        
        require(value >= price);
        address seller = auctions[i].seller;
        
        //only when bid success, we'll delete auction
        delete auctions[i];
        
        uint256 left = price;
        uint256 toOwner = price * ownerCut / 100;
        left = left - toOwner;
        earned[address(this)] += toOwner;
        
        uint256[] memory ups = upTokens(i);
        uint256 split = price * 6 / 100;
        
        for(uint j = 0; j < ups.length; j ++) {
            address _owner = ownerOf(ups[j]);
            if (_owner != address(0)) {
                earned[_owner] += split;
                left = left - split;
            }
        }
        
        earned[seller] += left;
        return price;
    }
    
    function isAuctionContract() pure public returns (bool) {
        return true;
    }
    
    /**
     * Bid a on sell token, user should pay more than the current price
     * the exceeds will return to the buyer with the token
     * and the token's price will be updated
     */
    function bid(uint256 i) public payable onStage(i, Stage.ONSELL) whenNotPaused {
        // require((getStage(i) == Stage.INITIAL)||(getStage(i) == Stage.ONSELL));
        address seller = auctions[i].seller;
        uint256 price = _bid(i, msg.value);
        _transfer(seller, msg.sender, i);
        msg.sender.transfer(msg.value - price); //return extra value
        positions[i].price = price;
        
        //immediatlely start a new auction on the current one
        auction(i);
    }
    
    /**
     * start auction on token user owned
     * this will transfer the token to the contract, let contract host the auction.
     * every time a new auction will start at the 1.5 price of the last price this token sold
     * 
     * update:
     * now the auction won't take ownership of the token
     */
    function auction(uint256 i) public tokenOwner(i) onStage(i, Stage.OWNED) whenNotPaused {
        _fromId(i); //id validation
        // _transfer(msg.sender, address(this), i);
        uint256 price = positions[i].price * 160 / 100;
        assert(price >= positions[i].price);
        _createAuction(i, price, positions[i].price, uint256(30 days), msg.sender);
    }
    
    /**
     * cancel an auction.
     * the auction should be hosted by the contract and the seller should be the sender
     * clear the auction info, and return the token to the sender
     */
    function cancelAuction(uint256 i) public tokenOwner(i) onStage(i, Stage.ONSELL) whenNotPaused {
        _fromId(i); //id validation
        require(auctions[i].seller == msg.sender);
        
        _cancelAuction(i);
    }
    
    //only allow admin to create auction on INITIAL tokens
    //after creation, change the owner of the land to the contract
    function produce(uint256 i, uint256 _sprice, uint256 _eprice) public onlyAdmin whenNotPaused onStage(i, Stage.INITIAL) {
        _fromId(i); // id validation
        
        _transfer(address(0), address(this), i);
        _createAuction(i, _sprice, _eprice, uint256(30 days), address(this));
    }
    
    function produce_batch(uint256[] ids, uint256 _sprice, uint256 _eprice) public onlyAdmin whenNotPaused {
        uint i = 0;
        for(; i < ids.length; i ++) {
            produce(ids[i], _sprice, _eprice);
        }
    }
    
    ////////////////////////ERC721////////////////////////////////////////////////////////
    
    //transfer just change the owner  and seller
    function transfer(address _to, uint256 _pos_id) public tokenOwner(_pos_id)
    {
        require(_to != address(0));
        _transfer(msg.sender, _to, _pos_id);
        auctions[_pos_id].seller = _to;
    }
  
    function transferFrom(address _from, address _to, uint256 _id) public 
    {
        require(_to != address(0));
        require(positions[_id].owner == _from);
        require(approved[_id] == msg.sender);
        
        _transfer(_from, _to, _id);
        auctions[_id].seller = _to;
    }
    
    function reproducable(uint256 i) public view returns (bool) {
        return positions[i].cooldown <= now;
    }

    function timeRemain(uint256 i) public view returns (uint256) {
        if (now >= positions[i].cooldown) {
            return now - positions[i].cooldown;
        } else {
            return 0;
        }
    }

    function reproduce(uint256 i) public tokenOwner(i) payable whenNotPaused {
        uint256[] memory _ava = available(i);
        require(_ava.length > 0);
        require(reproducable(i));
        
        uint256 _randSeed;
        if (address(randSource) != address(0)) {
            _randSeed = randSource.rand();
        } else {
            _randSeed = _rand();
        }
        uint256 j = _randSeed % _ava.length;
        uint256 fee = positions[i].price * 60 / 100;
        assert(positions[i].price >= fee);
        
        uint256 price = fee;
        require(msg.value >= fee);

        j = _ava[j];
        uint256 _childCooldown = now + _genCooldown(positions[i].gen + 1);
        _createToken(j, msg.sender, price, positions[i].gen + 1, _childCooldown);
        positions[i].cooldown = now + _genCooldown(positions[i].gen);
        auction(j);

        earned[this] += fee;
        msg.sender.transfer(msg.value - fee);

    }
    
    function withdrawal() public {
        uint256 _earn = earned[msg.sender];
        earned[msg.sender] = 0;
        
        
        if (msg.sender == owner) {
            _earn += earned[this];
            earned[this] = 0;
        }
        
        if(_earn > 0) {
            msg.sender.transfer(_earn);
        }
        
    }
}
    
contract RandSource {
    function rand() public returns (uint256);
}