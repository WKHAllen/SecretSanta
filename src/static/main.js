var rows = 0;
const idLength = 8;

const formRow = `
    <div class="form-row" id="form-main-row-{0}">
        <div class="form-group col-5">
            <input type="text" class="form-control" name="name-{0}" placeholder="Name" autocomplete="off" />
        </div>
        <div class="form-group col">
            <input type="email" class="form-control" name="email-{0}" placeholder="Email" autocomplete="off" />
        </div>
        <div class="form-group col-auto">
            <button type="button" class="btn btn-light btn-block" onclick="removeRow({0});">&times;</button>
        </div>
    </div>
`;

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
    ++rows;
    var newFormRow = replaceAll(formRow, () => rows, () => randomId(idLength));
    document.getElementById('form-main').innerHTML += newFormRow;
}

function removeRow(rowNum) {
    var row = document.getElementById(`form-main-row-${rowNum}`);
    row.parentNode.removeChild(row);
}

window.addEventListener('load', () => {
    for (var i = 0; i < 4; i++) addRow();
});
