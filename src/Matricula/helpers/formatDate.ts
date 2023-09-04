export const formatDate = (date: Date) => {
    const meses = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
    ];

    const fecha = new Date(date);
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();

    const fechaFormateada = `${dia} de ${mes} del ${año}`;
    return fechaFormateada;
};

export const getDateFormatWH = (date: Date) => {
    const temp = new Date(
        new Date(date).getTime() + new Date(date).getTimezoneOffset() * 60000
    );
    const day =
        temp.getDate().toString().length == 1
            ? `0${temp.getDate()}`
            : temp.getDate();
    const month =
        (temp.getMonth() + 1).toString().length == 1
            ? `0${temp.getMonth() + 1}`
            : temp.getMonth() + 1;
    const year = temp.getFullYear();
    return `${day}/${month}/${year}`;
};
