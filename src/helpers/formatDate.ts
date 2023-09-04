export const formatedDate = (date: Date): string => {
    const newDate = new Date(date);
    const days = newDate.toLocaleDateString();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();

    return `${days}/${month}/${year}`;
};
