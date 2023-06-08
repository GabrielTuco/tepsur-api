export interface CreateSecretaryDTO {
    sedeUuid: string;
    dni: string;
    nombres: string;
    apePaterno: string;
    apeMaterno: string;
    celular: string;
    correo: string;
}

export interface CreateSecretaryUserDTO {
    usuario: string;
    password: string;
    codRol: number;
    secretaryUuid: string;
}

export type UpdateSecretaryDTO = Partial<CreateSecretaryDTO>;
