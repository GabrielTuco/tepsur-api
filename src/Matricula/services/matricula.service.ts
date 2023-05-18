import {v4 as uuid} from 'uuid'
import { Alumno } from "../../Student/entity/Alumno.entity";
import { Carrera, GradoEstudios, Grupo, Matricula } from "../entity";
import { MatriculaDTO, AlumnoData } from '../interfaces/dtos';
import { MatriculaRepository } from "../interfaces/repositories";
import { Direccion } from '../../entity';
import { adaptedDireccion } from '../adapters/direccion.adapter';
import { Rol, Usuario } from '../../Auth/entity';
import { encryptPassword } from '../../helpers/encryptPassword';
import { Secretaria } from '../../Secretary/entity/Secretaria.entity';
import { Sede } from '../../Sede/entity/Sede.entity';

export class MatriculaService implements MatriculaRepository {
    public async register(data: MatriculaDTO): Promise<Matricula> {
        try {
            const {alumno,carreraUuid,grupoUuid,pagoMatricula,secretariaUuid,sedeUuid, fechaInscripcion} = data
            
            const newAlumno = await this.registerStudent(alumno);

            const newMatricula = new Matricula();
            const carrera = await Carrera.findOneBy({uuid:carreraUuid});
            const grupo = await Grupo.findOneBy({uuid: grupoUuid});
            const secretaria = await Secretaria.findOneBy({uuid: secretariaUuid});
            const sede = await Sede.findOneBy({id: sedeUuid});

            newMatricula.uuid = uuid();
            newMatricula.carrera = carrera!;
            newMatricula.alumno = newAlumno;
            newMatricula.grupo = grupo!;
            newMatricula.secretaria = secretaria!;
            newMatricula.sede = sede!;
            newMatricula.fecha_inscripcion = fechaInscripcion!;

            //TODO: Ver la logica para registrar el pago de matricula
            return await newMatricula.save();
            

        } catch (error) {
            throw error
        }
    }
    findByStudent(_uuid: number): Promise<Matricula> {
        throw new Error("Method not implemented.");
    }
    findByUuid(_uuid: number): Promise<Matricula> {
        throw new Error("Method not implemented.");
    }
    private async registerStudent(alumno:AlumnoData){
        try {
            const newDireccionAlumno = new Direccion();
            Object.assign(newDireccionAlumno,adaptedDireccion(alumno.direccion));
            await newDireccionAlumno.save();
            
            const gradoEstudios = await GradoEstudios.findOneBy({uuid:alumno.gradoEstudiosUuid});

            const rol = await Rol.findOneBy({nombre:"Alumno"});
            const newUserAlumno = new Usuario();
            newUserAlumno.usuario = alumno.dni;
            newUserAlumno.password = encryptPassword(alumno.dni);
            newUserAlumno.rol = rol!;
            await newUserAlumno.save();

            const newAlumno = new Alumno();
            newAlumno.uuid = uuid();
            newAlumno.dni = alumno.dni;
            newAlumno.nombres = alumno.nombres;
            newAlumno.ape_materno = alumno.apeMaterno;
            newAlumno.ape_paterno = alumno.apePaterno;
            newAlumno.edad = alumno.edad;
            newAlumno.sexo = alumno.sexo;
            newAlumno.lugar_nacimiento = alumno.lugarNacimiento;
            newAlumno.celular = alumno.celular;
            newAlumno.correo = alumno.correo;
            newAlumno.estado_civil = alumno.estadoCivil;
            newAlumno.direccion = newDireccionAlumno;
            newAlumno.grado_estudios = gradoEstudios!;
            newAlumno.usuario = newUserAlumno;

            return await newAlumno.save();
        } catch (error) {
            throw error
        }
    }

}