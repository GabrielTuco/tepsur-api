import axios from "axios";

export class ValidateDniService {
    public async validateDniBasic(dni: string) {
        try {
            const resp = await axios.get(
                `https://api.apis.net.pe/v1/dni?numero=${dni}`,
                {
                    headers: {
                        Authentication: `${process.env.APIS_NET_API_TOKEN}`,
                    },
                }
            );

            return resp.data;
        } catch (error) {
            throw error;
        }
    }
}
