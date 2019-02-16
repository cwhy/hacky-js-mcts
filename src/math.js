export const randChoice = (choices) => {
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
};
export const uctScore = (score, visits, nSims, exploreCoef) => {
    const w = score;
    const n = visits;
    const N = nSims;
    const c = exploreCoef;
    const x = w/n + Math.sqrt(Math.log(N)/n)*c;
    if(x===0){
        console.log(w, n, N, c);
        return null;
    }
    return w/n + Math.sqrt(Math.log(N)/n)*c;
};
