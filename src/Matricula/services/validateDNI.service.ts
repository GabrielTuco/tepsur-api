import axios from "axios";
import { Alumno } from "../../Student/entity";

export class ValidateDniService {
    public async validateDniBasic(dni: string) {
        try {
            const alumnoExists = await Alumno.findOneBy({ dni });
            if (!alumnoExists) {
                const resp = await axios.get(
                    `https://api.apis.net.pe/v1/dni?numero=${dni}`,
                    {
                        headers: {
                            Authentication: `${process.env.APIS_NET_API_TOKEN}`,
                        },
                    }
                );

                return resp.data;
            } else return alumnoExists;
        } catch (error) {
            throw error;
        }
    }
}
