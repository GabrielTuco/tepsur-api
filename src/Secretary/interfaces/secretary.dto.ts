export interface CreateSecretaryDTO {
    codSede: number;
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
    codSecretary: number;
}

export type UpdateSecretaryDTO = Partial<CreateSecretaryDTO>;
