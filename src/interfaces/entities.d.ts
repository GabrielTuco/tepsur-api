export interface SecretaryEntity {
    codSede: number;
    dni: string;
    nombres: string;
    apePaterno: string;
    apeMaterno: string;
    celular: string;
    correo: string;
}

export interface UserEntity {
    usuario: string;
    password: string;
    codRol: number;
}
