var rows = 0;
var totalRows = 0;
const idLength = 8;

// This will become useful in the unlikely event that Google decides to fix their Chrome autocomplete problem
function randomId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++)
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}

function replaceAll(string, ...functions) {
    for (var i = 0; i < functions.length; i++)
        while (string.includes(`{${i}}`))
            string = string.replace(`{${i}}`, functions[i]());
    return string;
}

function addRow() {
    rows++;
    totalRows++;
    // Indented to show the general structure
        var newRow = document.createElement('div');
        newRow.classList.add('form-row');
        newRow.id = `form-main-row-${rows}`;
            var nameDiv = document.createElement('div');
            nameDiv.classList.add('form-group');
            nameDiv.classList.add('col-5');
                var nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.classList.add('form-control');
                nameInput.name = `name-${rows}`;
                nameInput.placeholder = 'Name';
                nameInput.autocomplete = 'off';
                nameInput.required = 'required';
                nameDiv.appendChild(nameInput);
            newRow.appendChild(nameDiv);
            var emailDiv = document.createElement('div');
            emailDiv.classList.add('form-group');
            emailDiv.classList.add('col');
                var emailInput = document.createElement('input');
                emailInput.type = 'email';
                emailInput.classList.add('form-control');
                emailInput.name = `email-${rows}`;
                emailInput.placeholder = 'Email';
                emailInput.autocomplete = 'off';
                emailInput.required = 'required';
                emailDiv.appendChild(emailInput);
            newRow.appendChild(emailDiv);
            var xButtonDiv = document.createElement('div');
            xButtonDiv.classList.add('form-group');
            xButtonDiv.classList.add('col-auto');
                var xButton = document.createElement('button');
                xButton.type = 'button';
                xButton.classList.add('btn');
                xButton.classList.add('btn-light');
                xButton.classList.add('btn-block');
                xButton.setAttribute('onclick', `removeRow(${rows});`);
                xButton.innerHTML = '&times;';
                xButtonDiv.appendChild(xButton);
            newRow.appendChild(xButtonDiv);
        document.getElementById('form-main').appendChild(newRow);
}

function removeRow(rowNum) {
    var row = document.getElementById(`form-main-row-${rowNum}`);
    row.parentNode.removeChild(row);
    totalRows--;
}

function showMessage(message) {
    var newMessage = document.createElement('div');
    newMessage.classList.add('alert');
    newMessage.classList.add('alert-primary');
    newMessage.innerText = message;
    var formMessageArea = document.getElementById('form-message');
    formMessageArea.innerHTML = '';
    formMessageArea.appendChild(newMessage);
}

function checkInputs() {
    if (totalRows >= 4 && totalRows <= 30) {
        return true;
    } else {
        event.preventDefault();
        showMessage('You must have between 4 and 30 people playing.');
        return false;
    }
}

window.addEventListener('load', () => {
    for (var i = 0; i < 4; i++) addRow();
});
