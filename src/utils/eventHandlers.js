let btnLogIn = document.querySelector('#btnLogIn');
let btnSignup = document.querySelector('#btnSignUp');

let content = document.querySelector('#content');

let datafile = '../dummyData.json';

let donorHomePageHtml = '../donorHomePage.html';
let beneficiaryHomePageHtml = '../beneficiaryHomePage.html';
let donatePageHtmlFile = '..//donationCampaigns.html';
let createCharityPageHtml = '../createCharity.html';

let DONOR = 'Donor';
let BENEFICIARY = 'Beneficiary';
let logAsDonor = false;

btnSignup.addEventListener('click', () => {
    console.dir('in btn sign up');
});

function loadHomePage() {
    let email = document.querySelector('#txtBoxEmail').value;
    let password = document.querySelector('#txtBoxPwd').value;

    console.dir(isValidUser(email,password))
    if (isValidUser(email, password)) {
        let logInChoice = document.querySelector('#logInChoice');
        if (logInChoice.value == DONOR) {
            // load layout for donors
            logAsDonor = true;
            loadLayoutPage(donorHomePageHtml);
        } else if (logInChoice.value == BENEFICIARY) {
            // load layout for beneficiary
            loadLayoutPage(beneficiaryHomePageHtml);
        }
    } else {
        //print no such an user
    }
}

function laodAboutPage() {
    console.log('in about ')
}

async function laodDonatePage() {
    console.log('in donate ')
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

function createCharity() {
    let type = document.querySelector('#txtBoxCharityType').value;
    let desc = document.querySelector('#txtBoxCharityDesc').value;
    let amount = parseInt(document.querySelector('#txtBoxCharityAmount').value, 10);
    let daysOpen = parseInt(document.querySelector('#txtBoxDaysOpen').value,10);
    let addressReceiver = document.querySelector('#txtAddressToDonate').value;

    App.createCharity(type, desc, amount, daysOpen, addressReceiver);
    loadHomePageBeneficiary();
}

async function donateToCharity() {
    console.dir("CHARITY OPTION")
    let charityChoice = document.querySelector('#charityDropDown').value;
    if (charityChoice != "Selected charity") {
        let charities = await App.loadCharitiesNamesAndAddresses();
        let idCharity = getUserCharity(charities, charityChoice);
        await App.donateNthCharity(idCharity, 100);
    }else {
        window.alert("Please select a charity..")
    }
}