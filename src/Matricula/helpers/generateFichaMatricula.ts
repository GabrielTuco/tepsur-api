import PDF from "pdfkit-table";
import { Matricula } from "../entity";
import { formatDate } from "./formatDate";

export const generateFichaMatricula = async (data: Matricula, doc: PDF) => {
  try {
    const {
      alumno,
      carrera,
      //grupo,
      sede,
      //modulo,
      fecha_inicio,
      fecha_inscripcion,
      pagoMatricula,
    } = data;
    const { departamento, provincia, distrito } = alumno.direccion;

    doc.image("./public/imgs/logo_tepsur.png", {
      fit: [460, 40],
      align: "center",
      valign: "center",
    });
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(20).text("Ficha de matricula", {
      align: "center",
      lineGap: 20,
    });
    doc.font("Helvetica").fontSize(16);

    const tableNombres = {
      title: "Datos del estudiante",
      headers: ["Apellido paterno", "Apellido materno", "Nombres", "Sexo"],
      padding: 5,
      rows: [
        [
          alumno.ape_paterno,
          alumno.ape_materno,
          alumno.nombres,
          alumno.sexo === "m" ? "Masculino" : "Femenino",
        ],
      ],
    };

    const tableDireccion = {
      headers: ["Direccion exacta"],
      padding: 5,
      rows: [[alumno.direccion.direccion_exacta]],
    };

    const tableDireccion2 = {
      headers: ["Departamento", "Provincia", "Distrito"],
      padding: 5,
      rows: [[departamento, provincia, distrito]],
    };

    const tableDatos = {
      headers: ["Edad", "Grado estudios", "Documento de identidad"],
      padding: 5,
      rows: [
        [String(alumno.edad), alumno.grado_estudios.descripcion, alumno.correo],
      ],
    };

    const tableDatos2 = {
      headers: ["Lugar de residencia", "Celular", "Correo"],
      padding: 5,
      rows: [
        [
          alumno.lugar_residencia,
          alumno.celular ? alumno.celular : "-",
          alumno.correo ? alumno.correo : "-",
        ],
      ],
    };

    const tableDatosAcademicos = {
      title: "Datos académicos",
      headers: [
        "Carrera/Especialidad",
        //"Modulo",
        "Horario",
        "Modalidad/Sede",
      ],
      padding: 5,
      rows: [
        [
          carrera.nombre,
          //modulo.nombre,
          //`${grupo.horario.dias} / ${grupo.horario.hora_inicio}:00 ${grupo.horario.hora_fin}:00`,
          `${/*carrera.modalidad*/ ""} - ${sede.nombre}`,
        ],
      ],
    };

    const tableDatosPagoMatricula = {
      title: "Pago de matricula",
      headers: ["Numero comprobante", "Forma de pago", "Monto"],
      padding: 5,
      rows: [
        [
          pagoMatricula.num_comprobante,
          pagoMatricula.forma_pago.description,
          `S/. ${pagoMatricula.monto}`,
        ],
      ],
    };

    doc
      .fontSize(14)
      .text(`Fecha: ${fecha_inscripcion.toLocaleDateString()}`, {
        lineGap: 10,
      });

    await doc.table(tableNombres, {
      minRowHeight: 20,
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(11),
      prepareRow: () => {
        doc.font("Helvetica").fontSize(11);
        return doc;
      },
    });

    await doc.table(tableDireccion, {
      minRowHeight: 20,
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(11),
      prepareRow: () => {
        doc.font("Helvetica").fontSize(11);
        return doc;
      },
    });

    await doc.table(tableDireccion2, {
      minRowHeight: 20,
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(11),
      prepareRow: () => {
        doc.font("Helvetica").fontSize(11);
        return doc;
      },
    });

    await doc.table(tableDatos, {
      minRowHeight: 20,
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(11),
      prepareRow: () => {
        doc.font("Helvetica").fontSize(11);
        return doc;
      },
    });

    await doc.table(tableDatos2, {
      minRowHeight: 20,
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(11),
      prepareRow: () => {
        doc.font("Helvetica").fontSize(11);
        return doc;
      },
    });

    await doc.table(tableDatosAcademicos, {
      minRowHeight: 20,
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(11),
      prepareRow: () => {
        doc.font("Helvetica").fontSize(11);
        return doc;
      },
    });

    await doc.table(tableDatosPagoMatricula, {
      minRowHeight: 20,
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(11),
      prepareRow: () => {
        doc.font("Helvetica").fontSize(11);
        return doc;
      },
    });

    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("Inicio: ")
      .font("Helvetica")
      .text(`${formatDate(fecha_inicio)} `);

    doc.end();
  } catch (error) {
    throw error;
  }
};
