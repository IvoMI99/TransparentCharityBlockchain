App = {
  loading: false,
  account: undefined,
  contracts: {},

  load: async() => {
      await App.loadWeb3();
      await App.loadAccount();
      await App.loadContracts();
      await App.render();
  },

  loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          await ethereum.enable()
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
        }
      }
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        web3.eth.sendTransaction({/* ... */})
      }
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },

  loadAccount: async() => {
      await window.ethereum.enable();
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      App.account = accounts[0];
    },

  loadContracts: async() => {
    //Deploying charity factory
    const charityFactory = await $.getJSON('CharityFactory.json');
    App.contracts.CharityFactory = TruffleContract(charityFactory);
    App.contracts.CharityFactory.setProvider(App.web3Provider);
    App.charityFactory = await App.contracts.CharityFactory.deployed()
    //Deploying ngo
    const ngo = await $.getJSON('NGO.json');
    App.contracts.NGO = TruffleContract(ngo);
    App.contracts.NGO.setProvider(App.web3Provider);
    App.NGO = await App.contracts.NGO.deployed()
  },

  render: async() => {
    if (App.loading) {
      return;
    }
    App.setLoading(true);
    $('#account').html(App.account);
    App.setLoading(false);
  },

  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $('#loader');
    const content = $('#content');
    if (boolean) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },

  createCharity: async(type, desc, amount, daysOpen, addressReceiver) => {
    const resAddr = await App.charityFactory.newCharity(type, desc, amount, addressReceiver, daysOpen, {from: App.account})
  },

  getCharitiesCnt: async() => {
    const cnt = await App.charityFactory.cnt();
    return cnt.toNumber();
  },

  getCharitiesNames: async() => {
    const cnt = await App.getCharitiesCnt();
    var charitiesNames = []
    for (let i = 0; i < cnt; i++) {
      const charityName = await App.charityFactory.getNthCharityName(i);
      charitiesNames.push(charityName);
    }
    return charitiesNames
  },

  loadCharitiesNamesAndAddresses: async() => {
    let cnt = await App.charityFactory.cnt();
    let charities = []
    for (let i = 0; i < cnt; i++) {
        let charityName = await App.charityFactory.getNthCharityName(i);
        let charityAddress = await App.charityFactory.getNthCharityAddress(i);
        let pair = {id: i, name: charityName, address: charityAddress};
        charities.push(pair);
    }
    return charities;
  },

  getNthCharity: async(n) => {
    let charity = await App.charityFactory.getNthCharity(n);
    return charity;
  },

  donateNthCharity: async(n, amount) => {
    let amountTxt = amount.toString();
    let toAddr = await App.charityFactory.getNthCharityAddress(n);
    console.dir(toAddr);
    // await App.charityFactory.donateNthCharity(n, { from: App.account, value: web3.utils.toWei(amountTxt, "ether")}).call();
    App.sendEth(App.account, toAddr, amount);
  },

  //NGO funcs.
  createCharityNGO: async(type, desc, amount, daysOpen, addressReceiver) => {
    let res = await App.NGO.addCharity(type, desc, amount, addressReceiver, daysOpen, {from: App.account})
    console.dir(res)
  },

  sendEth: async(from, to, amount) => {
    const pkey = '7eefda2786c8630ce0e2c40aab6abcddf52304d89ee44dfb8001318fd8dceea1'
    const myAddress = from
    const toAddress = to


    const amountEth = web3.utils.toWei(amount.toString(), "ether");
    console.dir(amountEth);

    const transaction = {
      'from': from,
      'to': to,
      'value': amountEth,
      'gas': 30000,
      'maxFeePerGas': 30000,
      'maxPriorityFeePerGas': 30000,
     };

     const signedTx = await web3.eth.accounts.signTransaction(transaction, pkey);
     web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
      if (!error) {
        console.log("The hash of your transaction is: ", hash, "\n Check the block explorer!");
        console.log("WEI: "+amount+" sent to this address "+ toAddress)
      } else {
        console.log("Something went wrong while submitting your transaction:", error)
      }
     });
    },
}

$(() => {
    $(window).load(() => {
        App.load();
    })
})
