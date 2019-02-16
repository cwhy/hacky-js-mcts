const body = document.getElementsByTagName('body')[0];
const mapToObj = (map) => {
    return [...map].reduce((acc, val) => {
        acc[val[0]] = val[1];
        return acc;
    }, {});
}
const setToArray = (map) => {
    return [...map].reduce((acc, val) => {
        acc[val[0]] = val[1];
        return acc;
    }, {});
}
const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (value instanceof Map && value !== null) {
            value = mapToObj(value)
        } else if (value instanceof Set && value !== null) {
            value = Array.from(value)//.map((i)=>i.toString(2))
        }
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return "CircularRef";
            }
            seen.add(value);
        }
        return value;
    };
};

const customStringify = (obj) =>
    JSON.stringify(obj, getCircularReplacer(), 4);

export const reset = () => {body.innerHTML = "Hell-o-Wor LD" + '<br><br>'};
export const debug = x => {
    const dbjson = customStringify(x);
    body.innerHTML += "<pre> debug: " + dbjson + '<br></pre>';
};
export const debugState = x => {
    body.innerHTML += "<pre> State: " + JSON.stringify(x) + '<br></pre>';
};

export const arrayEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;


    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};
export const randInt = (min, max) => {
    if (min==null && max==null)
        return 0;

    if (max == null) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
};

export const hashState = (vector) =>
    // parseInt(vector.join(''), 2)
    vector.map(i=>i===-1?2:i).join('')
