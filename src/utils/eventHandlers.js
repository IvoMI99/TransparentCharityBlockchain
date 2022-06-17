let btnLogIn = document.querySelector('#btnLogIn');
let btnSignup = document.querySelector('#btnSignUp');

let content = document.querySelector('#content');

let datafile = '../dummyData.json';

let donorHomePageHtml = '../donorHomePage.html';
let beneficiaryHomePageHtml = '../beneficiaryHomePage.html';
let NGOHomePageHtml = '../ngoHomePage.html';
let donatePageHtmlFile = '../donationCampaigns.html';
let createCharityPageHtml = '../createCharity.html';
let createNGOCharityPageHtml = '../createNGOCharity.html'

let DONOR = 'Donor';
let NGO = 'NGO';
let BENEFICIARY = 'Beneficiary';
let logAsDonor = false;

btnSignup.addEventListener('click', () => {
});

function loadHomePage() {
    let email = document.querySelector('#txtBoxEmail').value;
    let password = document.querySelector('#txtBoxPwd').value;

    if (isValidUser(email, password)) {
        let logInChoice = document.querySelector('#logInChoice');
        if (logInChoice.value == DONOR) {
            // load layout for donors
            logAsDonor = true;
            loadLayoutPage(donorHomePageHtml);
        } else if (logInChoice.value == NGO) {
            // load layout for NGO
            loadLayoutPage(NGOHomePageHtml);
        } else if (logInChoice.value == BENEFICIARY) {
            // load layout for beneficiary
            loadLayoutPage(beneficiaryHomePageHtml);
        }
    } else {
        //print no such an user
    }
}

function laodAboutPage() {
}

async function laodDonatePage() {
    loadLayoutPage(donatePageHtmlFile);

    let charityNames = await App.getCharitiesNames();

    let charityDropDown = document.querySelector('#charityDropDown');

    for (var i = 0; i < charityNames.length; i++) {
        var option = '<option value="'+ `${charityNames[i]}` + '" >' + charityNames[i] + '</option>';
        charityDropDown.insertAdjacentHTML( 'beforeend', option );
    }
}

function loadHomePageDonor() {
    loadLayoutPage(donorHomePageHtml);
}

function loadHomePageBeneficiary() {
    loadLayoutPage(beneficiaryHomePageHtml);
}

function laodLoginPage() {
    loadLayoutPage('./login.html');
}

function laodCreateCharityPage() {
    loadLayoutPage(createCharityPageHtml);
}

function laodCreateNGOCharityPage() {
    loadLayoutPage(createNGOCharityPageHtml)
}

function createCharity() {
    let type = document.querySelector('#txtBoxCharityType').value;
    let desc = document.querySelector('#txtBoxCharityDesc').value;
    let amount = parseInt(document.querySelector('#txtBoxCharityAmount').value, 10);
    let daysOpen = parseInt(document.querySelector('#txtBoxDaysOpen').value,10);
    let addressReceiver = document.querySelector('#txtAddressToDonate').value;

    App.createCharity(type, desc, amount, daysOpen, addressReceiver);
    loadHomePageBeneficiary();
}

async function createCharityNGO() {
    let type = document.querySelector('#txtBoxCharityType').value;
    let desc = document.querySelector('#txtBoxCharityDesc').value;
    let amount = parseInt(document.querySelector('#txtBoxCharityAmount').value, 10);
    let daysOpen = parseInt(document.querySelector('#txtBoxDaysOpen').value,10);
    let addressReceiver = document.querySelector('#txtAddressToDonate').value;

    await App.createCharityNGO(type, desc, amount, daysOpen, addressReceiver);
    loadLayoutPage(NGOHomePageHtml)
}

async function donateToCharity() {
    let charityChoice = document.querySelector('#charityDropDown').value;
    let amount = parseInt(document.querySelector('#txtAmoutCharity').value);
    if (charityChoice != "Selected charity") {
        let charities = await App.loadCharitiesNamesAndAddresses();
        let idCharity = getUserCharity(charities, charityChoice);
        await App.donateNthCharity(idCharity, amount);
        loadHomePageDonor();
    }else {
        window.alert("Please select a charity..")
    }
}

async function donateToCharityNGO() {
    let charityChoice = document.querySelector('#ngoDropDown').value;
    let amount = parseInt(document.querySelector('#txtAmoutNGO').value);
    if (charityChoice != "Selected charity") {
        let charities = await App.loadCharitiesNamesAndAddresses();
        let idCharity = getUserCharity(charities, charityChoice);
        App.sendEth(App.account, '0xb52C4Dc6D72baecA41E0410214FCa144cE272849', amount);
        loadHomePageDonor();
    }else {
        window.alert("Please select a charity..")
    }
}