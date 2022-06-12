let btnLogIn = document.querySelector('#btnLogIn');
let btnSignup = document.querySelector('#btnSignUp');

let content = document.querySelector('#content');

let datafile = '../dummyData.json';

let donatePageHtmlFile = './donationCampaigns.html'

let DONOR = 'Donor';
let BENEFICIARY = 'Beneficiary';
let logAsDonor = false;

// btnLogIn.addEventListener('click', () => {

//     let email = document.querySelector('#txtBoxEmail').value;
//     let password = document.querySelector('#txtBoxPwd').value;

//     console.dir(isValidUser(email,password))
//     if (isValidUser(email, password)) {
//         let logInChoice = document.querySelector('#logInChoice');
//         if (logInChoice.value == DONOR) {
//             // load layout for donors
//             logAsDonor = true;
//             loadLayoutPage('./btn.html');
//         } else if (logInChoice.value == BENEFICIARY) {
//             // load layout for beneficiary
//             loadLayoutPage('./btn.html');
//         }
//     } else {
//         //print no such an user
//     }
// });

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
            loadLayoutPage('./btn.html');
        } else if (logInChoice.value == BENEFICIARY) {
            // load layout for beneficiary
            loadLayoutPage('./btn.html');
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
    loadLayoutPage('./btn.html');
}

function laodLoginPage() {
    loadLayoutPage('./login.html');
}