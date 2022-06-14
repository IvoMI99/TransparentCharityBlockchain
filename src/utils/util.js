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

function loadLayoutPage(sourceHtml) {
    var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('get', sourceHtml , true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            content.innerHTML = xhr.responseText;
        }
    }
    xhr.send();
}

function getUserCharity(charities, name) {
    for (let i = 0; i < charities.length; i++) {
        if (charities[i].name == name) {
            return charities[i].id;
        }
    }
}