export enum ROLES {
    ADMIN = "Administrador",
    SECRE = "Secretaria",
    DOCENTE = "Docente",
    ALUMNO = "Alumno",
    ROOT = "root",
}

export enum TIPO_MATRICULA {
    NUEVO = "nuevo",
    REINGRESO = "reingreso",
}

export enum ESTADO_GRUPO {
    EN_CURSO = "en_curso",
    CERRADO = "cerrado",
}

export enum CONDICION_ALUMNO {
    NUEVO = "nuevo",
    CONTINUA = "continua",
    CAMBIO_HORARIO = "cambio_horario",
}

export enum TIPO_CARRERA {
    MODULAR = "modular",
    SEMESTRAL = "semestral",
}

export enum MODALIDAD {
    VIRTUAL = "virtual",
    PRESENCIAL = "presencial",
}

export enum DIAS {
    LUN = "Lun",
    MAR = "Mar",
    MIE = "Mie",
    JUE = "Jue",
    VIE = "Vie",
    SAB = "Sab",
    DOM = "Dom",
}

export enum ESTADO_MODULO_MATRICULA {
    MATRICULADO = "matriculado", //Indica que el modulo se registro en la matricula para su asignacion a un grupo
    EN_CURSO = "en_curso", //Indica que el modulo actualmente se esta llevando
    CULMINADO = "culminado", //Indica que el modulo ya fue culminado por el alumno
    POR_LLEVAR = "por_llevar", //Indica que el modulo aun esta pendiente por llevar
}

export enum EstadoPagoPension {
    PENDIENTE = "PENDIENTE",
    COMPROMISO = "COMPROMISO",
    COMPLETO = "COMPLETO",
}
