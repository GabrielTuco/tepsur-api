import { Secretaria } from "../../Secretary/entity/Secretaria.entity";
import { Sede } from "../../Sede/entity";
import { Alumno } from "../../Student/entity";
import { Docente } from "../../Teacher/entity/Docente.entity";
import { Carrera, Horario, Modulo } from "../entity";

export const isSedeValid = async (uuid: string) => {
  const sede = await Sede.findOneBy({ uuid });
  if (!sede) throw new Error(`La sede con uuid ${uuid} no existe`);
};

export const isHorarioValid = async (uuid: string) => {
  const horario = await Horario.findOneBy({ uuid });
  if (!horario) throw new Error(`El horario con uuid ${uuid} no existe`);
};

export const isCarreraValid = async (uuid: string) => {
  const carrera = await Carrera.findOneBy({ uuid });
  if (!carrera) throw new Error(`La carrera con uuid ${uuid} no existe`);
};

export const isDocenteValid = async (uuid: string) => {
  const docente = await Docente.findOneBy({ uuid });
  if (!docente) throw new Error(`El docente con uuid ${uuid} no existe`);
};

export const isModuloValid = async (uuid: string) => {
  const modulo = await Modulo.findOneBy({ uuid });
  if (!modulo) throw new Error(`El modulo con uuid ${uuid} no existe`);
};

export const isSecretariaValid = async (uuid: string) => {
  const secretaria = await Secretaria.findOneBy({ uuid });
  if (!secretaria) throw new Error(`La secretaria con uuid ${uuid} no existe`);
};

export const isAlumnoDniValid = async (dni: string) => {
  const alumno = await Alumno.findOne({ where: { correo: dni } });
  if (alumno) throw new Error(`El alumno con dni ${dni} ya existe`);
};

export const isAlumnoCorreoValid = async (correo: string) => {
  const alumno = await Alumno.findOne({ where: { correo } });
  if (alumno) throw new Error(`El alumno con correo ${correo} ya existe`);
};
