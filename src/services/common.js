function flatten(array) {
    var flattend = [];
    (function flat(array) {
        for (let i = 0; i < array.length; i++) {
            if (Array.isArray(array[i])) flat(array[i]);
            else flattend.push(array[i]);
        }
    })(array);

    return flattend;
}

function isEmptyObject(obj) {
    for (let i in obj) {
        return false;
    }
    return true;
}

export { flatten, isEmptyObject };