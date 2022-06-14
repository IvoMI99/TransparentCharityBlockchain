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
    const charityFactory = await $.getJSON('CharityFactory.json');
    App.contracts.CharityFactory = TruffleContract(charityFactory);
    App.contracts.CharityFactory.setProvider(App.web3Provider);
    console.log(charityFactory);
    App.charityFactory = await App.contracts.CharityFactory.deployed()

    // const name = "name";
    // const desc = "desc";
    // const amount = 1;
    // const addr = '0x95E7813B58b131A3564Eb1db72A6D17047A4452C';
    // const daysOpen = 1;
    // const resAddr = await App.charityFactory.newCharity(name, desc, amount, addr, daysOpen, {from: App.account})

    // console.dir(resAddr);
    // const cnt = await App.charityFactory.cnt();
    // console.dir(cnt)

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
    await App.charityFactory.donateNthCharity(n, amount,{ from: App.account});
  }
}

$(() => {
    $(window).load(() => {
        App.load();
    })
})
