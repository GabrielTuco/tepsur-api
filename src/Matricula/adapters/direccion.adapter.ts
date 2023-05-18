import { Direccion } from "../../entity"
import { DireccionData } from "../interfaces/dtos"

export const adaptedDireccion = (direccion:DireccionData):Partial<Direccion>=>{
    return {
        direccion_exacta: direccion.direccionExacta,
        distrito: direccion.distrito,
        provincia: direccion.provincia,
        departamento: direccion.departamento
    }
}