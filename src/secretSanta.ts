function range(num) {
    return [...Array(num).keys()];
}

function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
}

function goodAssignments(indices) {
    for (var i = 0; i < indices.length; i++)
        if (i === indices[i])
            return false;
    return true;
}

function getRandomAssignments(numPeople) {
    var indices = range(numPeople);
    shuffle(indices);
    while (!goodAssignments(indices))
        shuffle(indices);
    return indices;
}

function assignPeople(names) {
    var indices = getRandomAssignments(names.length);
    var people = {};
    for (var i = 0; i < names.length; i++)
        people[names[i]] = names[indices[i]];
    return people;
}

module.exports = {
    'goodAssignments': goodAssignments,
    'getRandomAssignments': getRandomAssignments,
    'assignPeople': assignPeople
};
