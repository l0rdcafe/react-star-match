export const colors = {
    available: "#eee",
    used: "lightgreen",
    wrong: "lightcoral",
    selected: "deepskyblue"
};

export const randomSum = (arr, maxSum) => {
    const sets = [[]];
    const sums = [];

    for (let i = 0; i < arr.length; i += 1) {
        for (let j = 0; j < sets.length; j += 1) {
            const candidateSet = sets[j].concat(arr[i]);
            const candidateSum = candidateSet.reduce((a, b) => a + b, []);
            if (candidateSum <= maxSum) {
                sets.push(candidateSet);
                sums.push(candidateSum);
            }
        }
    }
    return sums[Math.floor(Math.random() * sums.length)];
}

export const diff = (arr1, arr2) => arr1.filter(n => !arr2.includes(n));