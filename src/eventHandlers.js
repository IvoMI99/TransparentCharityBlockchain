let btnLogIn = document.querySelector('#btnLogIn');
let btnSignup = document.querySelector('#btnSignUp');

let content = document.querySelector('#content');

let datafile = '../dummyData.json';

let DONOR = 'Donor';
let BENEFICIARY = 'Beneficiary';

btnLogIn.addEventListener('click', () => {

    let email = document.querySelector('#txtBoxEmail').value;
    let password = document.querySelector('#txtBoxPwd').value;

    console.dir(isValidUser(email,password))
    if (isValidUser(email, password)) {
        let logInChoice = document.querySelector('#logInChoice');
        if (logInChoice.value == DONOR) {
            // load layout for donors
            var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            xhr.open('get', './btn.html', true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    content.innerHTML = xhr.responseText;
                }
            }
            xhr.send();
        } else if (logInChoice.value == BENEFICIARY) {
            // load layout for beneficiary
            var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            xhr.open('get', './btn.html', true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    content.innerHTML = xhr.responseText;
                }
            }
            xhr.send();
        }
    } else {
        //print no such an user
    }
});

btnSignup.addEventListener('click', () => {
    console.dir('in btn sign up');
});


function isValidUser(email, password) {
    return $.getJSON(datafile, function(json) {
        console.log(json);
        json.forEach(element => {
            if (element.email == email && element.password == password) {
                return true;
            }
        });
        return false
    });
}