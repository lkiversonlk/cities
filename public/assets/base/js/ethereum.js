var ethereum = function(onNetFail) {
    let errors = [
      "WEB3MISS",
      "SYSTEMERR",
      "NOACCOUNT",
      "UNKNOWNNETWORK",
      "NETWORKNOTSUPPORTED"
    ];

    let ERRORS = {};
    errors.forEach(err => {
      ERRORS[err] = err;
    });

    // networkdid => {contract: }
    let NETWORKS = {
      "3" : "0x30acf4df496e7ed7430149d859379c0bd74a0b28"
    };

    let abi = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"earned","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"randSource","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxLon","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_pos_id","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"i","type":"uint256"}],"name":"auction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"i","type":"uint256"}],"name":"reproduce","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_id","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isAuctionContract","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"i","type":"uint256"}],"name":"getStage","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxLv","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"i","type":"uint256"}],"name":"upTokens","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"i","type":"uint256"}],"name":"bid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"i","type":"uint256"},{"name":"_sprice","type":"uint256"},{"name":"_eprice","type":"uint256"}],"name":"produce","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"latOffset","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"auctions","outputs":[{"name":"seller","type":"address"},{"name":"startPrice","type":"uint256"},{"name":"endPrice","type":"uint256"},{"name":"duration","type":"uint256"},{"name":"startAt","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"owner","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"owned","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_admin","type":"address"}],"name":"setAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"approved","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ownerCut","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"i","type":"uint256"}],"name":"cancelAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"i","type":"uint256"}],"name":"available","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lonOffset","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"positions","outputs":[{"name":"id","type":"uint256"},{"name":"owner","type":"address"},{"name":"price","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_pos_id","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"bidFloor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxLat","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"lv","type":"uint256"},{"name":"fee","type":"uint256"},{"name":"_bidFloor","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"startPrice","type":"uint256"},{"indexed":false,"name":"endPrice","type":"uint256"},{"indexed":false,"name":"duration","type":"uint256"}],"name":"AuctionCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"},{"indexed":false,"name":"winner","type":"address"}],"name":"AuctionSuccessful","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"}],"name":"AuctionCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"approved","type":"address"},{"indexed":false,"name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"id","type":"uint256"}],"name":"NewToken","type":"event"}]

    let getWeb3 = new Promise((resolve, reject) => {
      var web3 = window.web3
    
      if (typeof web3 !== 'undefined') {
        // web3 = new Web3(web3.currentProvider)
        console.log(`web3 found, connected ${web3.isConnected()}`)
        resolve({
          hasInjectedWeb3: web3.isConnected(),
          web3
        })
      } else {
        console.log(`web3 not found`)
        reject(ERRORS.WEB3MISS);
      }
    })
    .then(result => {
      return new Promise(function(resolve, reject) {
        result.web3.version.getNetwork((err, networkId) => {
          if (err) {
            console.log(`fail to get network id, ${err}`)
            reject(ERRORS.SYSTEMERR);
          } else {
            networkId = networkId.toString()
            console.log(`network id :${networkId}`)
            result = Object.assign({}, result, { networkId })
            resolve(result)
          }
        })
      })
    })
    .then(networkIdResult => {
      return new Promise(function(resolve, reject) {
        networkIdResult.web3.eth.getCoinbase((err, coinbase) => {
          let result
          if (err) {
            console.log(`fail to get coinbase: ${err}`)
            result = Object.assign({}, networkIdResult)
            reject(ERRORS.SYSTEMERR);
          } else {
            console.log(`coinbase: ${coinbase}`)
            result = Object.assign({}, networkIdResult, { coinbase })
            if (coinbase) {
              resolve(result)
            } else {
              reject(ERRORS.NOACCOUNT);
            }
          }
        })
      })
    })
    .then(coinbaseResult => {
      return new Promise(function(resolve, reject) {
        const address = coinbaseResult.web3.eth.defaultAccount
        console.log(`default account ${address}`)
        const result = Object.assign({}, coinbaseResult, { address })
        resolve(result)
      })
    })
    .catch(onNetFail)

    let getContractIns = () => {
      return new Promise((resolve, reject) => {
        return getWeb3
        .then(ethereum => {
          if(!NETWORKS.hasOwnProperty(ethereum.networkId)) {
            return reject(ERRORS.UNKNOWNNETWORK);
          }
          let c_addr = NETWORKS[ethereum.networkId];
  
          if (c_addr) {
            let contract = ethereum.web3.eth.contract(abi);
            return resolve(contract.at(c_addr));
          } else {
            return reject(ERRORS.NETWORKNOTSUPPORTED);
          }
        })
      })
    }

    return {
      getWeb3,
      getContractIns,
    }
};