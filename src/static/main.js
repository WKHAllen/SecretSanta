var rows = 0;

const formRow = `
    <div class="form-row" id="form-main-row-{}">
        <div class="form-group col-5">
            <input type="text" class="form-control" name="name-{}" placeholder="Name" autocomplete="off" />
        </div>
        <div class="form-group col">
            <input type="email" class="form-control" name="email-{}" placeholder="Email" autocomplete="off" />
        </div>
        <div class="form-group col-auto">
            <button type="button" class="btn btn-light btn-block" onclick="removeRow({});">&times;</button>
        </div>
    </div>
`;

function addRow() {
    var newRow = ++rows;
    var newFormRow = formRow;
    while (newFormRow.includes('{}'))
        newFormRow = newFormRow.replace('{}', newRow);
    document.getElementById('form-main').innerHTML += newFormRow;
}

function removeRow(rowNum) {
    var row = document.getElementById(`form-main-row-${rowNum}`);
    row.parentNode.removeChild(row);
}

window.addEventListener('load', () => {
    for (var i = 0; i < 4; i++) addRow();
});
