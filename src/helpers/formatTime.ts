export const formatedTime = (date: Date): string => {
    const newDate = new Date(date);
    const hours =
        newDate.getHours() > 12 ? newDate.getHours() - 12 : newDate.getHours();
    const minutes =
        newDate.getMinutes() < 10
            ? `0${newDate.getMinutes()}`
            : newDate.getMinutes();
    const ampm = newDate.getHours() < 12 ? "am" : "pm";

    return `${hours}:${minutes} ${ampm}`;
};
