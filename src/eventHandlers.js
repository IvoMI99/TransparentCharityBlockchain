let btnLogIn = document.querySelector('#btnLogIn');
let btnSignup = document.querySelector('#btnSignUp');

let content = document.querySelector('#content');

let datafile = '../dummyData.json';

let donorHomePageHtml = './donorHomePage.html';
let beneficiaryHomePageHtml = 'beneficiaryHomePage.html';
let donatePageHtmlFile = './donationCampaigns.html';
let createCharityPageHtml = './createCharity.html';

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

function laodDonatePage() {
    console.log('in donate ')
    loadLayoutPage(donatePageHtmlFile);
    // $(document).ready(function() {
    //     $("ul").append('<img src="./images/image.png" alt="home-page">')
    //     $("ul").append('<img src="./images/image.png" alt="home-page">')
    //     $("ul").append('<img src="./images/image.png" alt="home-page">')
    // });
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

    console.log(type);
    console.log(desc);
    console.log(amount);
    console.log(daysOpen);
    console.log(addressReceiver);
    //Create new Charity
    App.createCharity(type, desc, amount, daysOpen, addressReceiver);
    loadHomePageBeneficiary();
}