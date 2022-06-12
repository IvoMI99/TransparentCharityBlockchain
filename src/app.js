App = {
  loading: false,
  account: undefined,
  contracts: {},

  load: async() => {
      await App.loadWeb3();
      console.log("app loading..");
      await App.loadAccount();
      console.log("app loading..");
      await App.loadContracts();
      console.log("app loading1..");
      await App.render();
  },

  loadWeb3: async () => {
      console.log("in loadWeb3..");
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
      console.log("in loadWeb3..end");
    },

  loadAccount: async() => {
      await window.ethereum.enable();
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      App.account = accounts[0];
      console.log(App.account);
    },

  loadContracts: async() => {
    const receive = await $.getJSON('Receive.json');
    App.contracts.Receive = TruffleContract(receive);
    App.contracts.Receive.setProvider(App.web3Provider);
    console.log(receive);

    App.receive = await App.contracts.Receive.deployed()
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
  }
}


$(() => {
    $(window).load(() => {
        App.load();
    })
})
