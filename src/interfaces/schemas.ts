export interface AdministratorSchema {
    id?: number;
    dni: string;
    nombres: string;
    apePaterno: string;
    apeMaterno: string;
    celular: string;
    correo: string;
    codUsuario?: number | null;
}

export interface UserSchema {
    id?: number;
    usuario: string;
    password: string;
    codRol: number;
}

export interface RolSchema {
    id?: number;
    nombre: string;
    estado?: boolean;
    permisos?: [];
}
