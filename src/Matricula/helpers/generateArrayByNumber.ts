export const generateArrayByNumber = (number: number) => {
    let array: number[] = [];
    for (let i = 1; i <= number; i++) {
        array.push(i);
    }

    return array;
};
