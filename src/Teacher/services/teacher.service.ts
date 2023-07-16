import { v4 as uuid } from "uuid";
import { Rol, Usuario } from "../../Auth/entity";
import { Sede } from "../../Sede/entity/Sede.entity";
import { Docente } from "../entity/Docente.entity";
import { TeacherSchema } from "../interfaces/teacher";
import { DatabaseError } from "../../errors/DatabaseError";
import { encryptPassword } from "../../helpers/encryptPassword";
import { UpdateTeacherDTO } from "../interfaces/dtos";

export class TeacherService {
  public listAll = async (): Promise<Docente[]> => {
    try {
      const data = await Docente.find({
        where: { estado: true },
        relations: { sede: true, usuario: true },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  public listBySede = async (sedeUuid: string): Promise<Docente[]> => {
    try {
      const data = await Docente.createQueryBuilder("d")
        .innerJoinAndSelect("d.sede", "s")
        .innerJoinAndSelect("d.usuario", "u")
        .where("s.uuid=:uuid and d.estado='true'", { uuid: sedeUuid })
        .getMany();

      return data;
    } catch (error) {
      throw error;
    }
  };

  public register = async ({
    apeMaterno,
    apePaterno,
    dni,
    nombres,
    sedeUuid,
  }: TeacherSchema): Promise<Docente> => {
    try {
      const newTeacher = new Docente();
      const sedeExists = await Sede.findOneBy({ uuid: sedeUuid });

      if (!sedeExists)
        throw new DatabaseError("La sede no existe", 404, "Not found error");

      newTeacher.uuid = uuid();
      newTeacher.dni = dni;
      newTeacher.nombres = nombres;
      newTeacher.ape_materno = apeMaterno;
      newTeacher.ape_paterno = apePaterno;
      newTeacher.sede = sedeExists;
      await newTeacher.save();

      newTeacher.usuario = await this.createUser(newTeacher.uuid);
      return await newTeacher.save();
    } catch (error) {
      throw error;
    }
  };

  public createUser = async (teacherUuid: string): Promise<Usuario> => {
    try {
      const teacher = await Docente.findOneBy({ uuid: teacherUuid });
      if (!teacher)
        throw new DatabaseError("EL docente no existe", 404, "Not found error");

      const rol = await Rol.findOneBy({ nombre: "Docente" });
      if (!rol)
        throw new DatabaseError("EL rol no existe", 404, "Not found error");

      const newUsuario = new Usuario();
      newUsuario.uuid = uuid();
      newUsuario.usuario = teacher.dni;
      newUsuario.password = encryptPassword(teacher.dni);
      newUsuario.rol = rol;

      const savedUsuario = await newUsuario.save();
      teacher.usuario = savedUsuario;

      return savedUsuario;
    } catch (error) {
      throw error;
    }
  };

  public searchByUuid = async (uuid: string): Promise<Docente> => {
    try {
      const docente = await Docente.findOne({
        where: { uuid },
        relations: { usuario: true, sede: true },
      });
      if (!docente)
        throw new DatabaseError("EL docente no existe", 404, "Not found error");

      return docente;
    } catch (error) {
      throw error;
    }
  };

  public searchByUser = async (usuario: Usuario): Promise<Docente> => {
    try {
      const teacher = await Docente.createQueryBuilder("d")
        .innerJoinAndSelect("d.usuario", "u")
        .innerJoinAndSelect("u.rol", "r")
        .innerJoinAndSelect("d.sede", "s")
        .where("u.uuid= :id and estado='true'", { id: usuario.uuid })
        .getOne();

      if (!teacher)
        throw new DatabaseError("EL docente no existe", 404, "Not found error");
      return teacher;
    } catch (error) {
      throw error;
    }
  };

  public update = async (
    updateTeacherData: UpdateTeacherDTO
  ): Promise<Docente> => {
    try {
      const adaptTeacherData = {
        nombres: updateTeacherData.nombres,
        ape_paterno: updateTeacherData.apePaterno,
        ape_materno: updateTeacherData.apeMaterno,
      };

      const docente = await Docente.findOneBy({ uuid: updateTeacherData.uuid });
      if (!docente)
        throw new DatabaseError("El docente no existe", 404, "Not found error");

      Object.assign(docente, adaptTeacherData);
      await docente.save();
      await docente.reload();

      return docente;
    } catch (error) {
      throw error;
    }
  };

  public delete = async (uuid: string): Promise<Docente> => {
    try {
      const docente = await Docente.findOneBy({ uuid });
      if (!docente)
        throw new DatabaseError("El docente no existe", 404, "Not found error");

      docente.estado = false;
      await docente.save();
      await docente.reload();

      return docente;
    } catch (error) {
      throw error;
    }
  };
}
