interface People {
    [name: string]: string;
}

function range(num: number): number[] {
    return [...Array(num).keys()];
}

function shuffle(array: any[]): void {
    let m = array.length;
    let i: number;
    let t: any;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
}

export function goodAssignments(indices: number[]): boolean {
    for (let i = 0; i < indices.length; i++)
        if (i === indices[i])
            return false;
    return true;
}

export function getRandomAssignments(numPeople: number): number[] {
    let indices = range(numPeople);
    shuffle(indices);
    while (!goodAssignments(indices))
        shuffle(indices);
    return indices;
}

export function assignPeople(names: string[]): People {
    const indices = getRandomAssignments(names.length);
    let people: People = {};
    for (let i = 0; i < names.length; i++)
        people[names[i]] = names[indices[i]];
    return people;
}
