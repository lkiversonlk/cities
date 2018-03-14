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

    let config = getWeb3
    .then(ethereum => {
      return new Promise((resolve, reject) => {
        $.get("/config.json", data => {
          if (data.current === ethereum.networkId) {
            resolve(data);
          } else {
            reject(ERRORS.NETWORKNOTSUPPORTED);
          }
        });
      })
    })

    let getContractIns = config
    .then(conf => {
      return getWeb3.then(ethereum => {
        let contract = ethereum.web3.eth.contract(conf.configs[conf.current].abi);
        return contract.at(conf.configs[conf.current].addr);
      })
    })


    /*
    (addr) => {
      return new Promise((resolve, reject) => {
        return getWeb3
        .then(ethereum => {
          /*
          if(!NETWORKS.hasOwnProperty(ethereum.networkId)) {
            return reject(ERRORS.UNKNOWNNETWORK);
          }
          let c_addr = NETWORKS[ethereum.networkId];
       
          
          return resolve(contract.at(c_addr));
        })
      })
    }*/

    let getPriceWithFloor = function(i) {
      return getContractIns
      .then(ins => {
        return new Promise((resolve, reject) => {
          ins.bidFloor((err, floor) => {
            if(err) {
              reject(err);
            } else {
              ins.currentPrice(i, (err, price) => {
                if(err) {
                  console.log(`fail to get ${i}'s info `, err);
                  reject(err);
                } else {
                  resolve(getWeb3
                    .then(ethereum=>{
                      return ethereum.web3.fromWei(price.toNumber());
                    }));
                }
              });
            }
          })
        })
      })
    }
    
    let buyToken = function(_i) {
      let i = parseInt(_i)
      getContractIns
      .then(ins => {
        return new Promise((resolve, reject) => {
          ins.currentPrice(i, (err, price) => {
            if(err) {
              reject(err)
            } else {
              ins.bid(i, {value: price.toNumber()}, (err, tx) => {
                if(err) {
                  return reject(err)
                } else {
                  return resolve(tx)
                }
              })
            }
          })
        })        
      })
    }

    let cancalAuction = function(_i) {
      let i = parseInt(_i)
      getContractIns
      .then(ins => {
        return new Promise((resolve, reject) => {
          ins.cancelAuction(i, (err, tx) => {
            if(err) {
              return reject(err)
            } else {
              return resolve(tx)
            }
          })
        })        
      })
    }

    let sellToken = function(_i) {
      let i = parseInt(_i)
      getContractIns
      .then(ins => {
        return new Promise((resolve, reject) => {
          ins.auction(i, (err, tx) => {
            if(err) {
              return reject(err)
            } else {
              return resolve(tx)
            }
          })
        })        
      })
    }

    let reproducable = function(_i) {
      let i = parseInt(_i)
      getContractIns
      .then(ins => {
        return new Promise((resolve, reject) => {
          ins.available(i, (err, results) => {
            if(err) {
              return reject(err)
            } else if(results.length > 0) {
              return resolve(true)
            } else {
              return resolve(false)
            }
          })
        })        
      })
    }

    let waitTx = function(_tx, _times) {
      let times = 10
      if(_times) {
        times = _times
      }
      let waitCnt = 0
      return getWeb3
      .then(ethereum => {
        return new Promise((resolve, reject) => {
          const waitTx = setInterval(
            () => {
              ethereum.web3.eth.getTransaction(txId, (err, tx) => {
                if (err) {
                  clearInterval(waitTx)
                  reject(err)
                } else {
                  if (tx.blockNumber) {
                    clearInterval(waitTx)
                    ethereum.web3.eth.getTransactionReceipt(txId, (err, tx) => {
                      if (err) {
                        reject(err)
                      } else {
                        resolve(tx)
                      }
                    })
                  } else {
                    // pending
                    waitCnt++
                    if (waitCnt > times) {
                      clearInterval(waitTx)
                      reject(`wait for ${txId} too long`)
                    }
                  }
                }
              })
            },
            20000
          )
        })
      })
    }

    return {
      getWeb3,
      getContractIns,
      config,
      waitTx,
      getPriceWithFloor,
      buyToken,
      sellToken,
      cancalAuction,
      reproducable
    }
};

ether = ethereum()

ether.getContractIns.catch((err) => {alert(err);})