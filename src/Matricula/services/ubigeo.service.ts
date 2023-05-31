import { AppDataSource } from "../../db/dataSource";
import { UbigeoRepository } from "../interfaces/repositories";

export class UbigeoService implements UbigeoRepository {
    public async listDepartaments(): Promise<any> {
        try {
            const departaments = await AppDataSource.manager.query(
                'select "ubigeoId", departamento from public.ubigeo  where provincia isnull and distrito isnull order by departamento'
            );

            return departaments.map(
                (d: { ubigeoId: string; departamento: string }) => ({
                    ubigeoId: d.ubigeoId.slice(0, 2),
                    departamento: d.departamento,
                })
            );
        } catch (error) {
            throw error;
        }
    }
    public async listProvinces(id: string): Promise<any> {
        try {
            const provinces = await AppDataSource.manager.query(
                `select "ubigeoId", provincia from public.ubigeo 
                where "ubigeoId" like ('${id}%') and distrito isnull and provincia is not null`
            );

            return provinces.map(
                (d: { ubigeoId: string; provincia: string }) => ({
                    ubigeoId: d.ubigeoId.slice(2, 4),
                    provincia: d.provincia,
                })
            );
        } catch (error) {
            throw error;
        }
    }
    public async listDistricts(
        departamentoId: string,
        provinciaId: string
    ): Promise<any> {
        try {
            const districts = await AppDataSource.manager.query(
                `select "ubigeoId", distrito from public.ubigeo 
                where "ubigeoId" like ('${
                    departamentoId + provinciaId
                }%') and provincia is not null and distrito is not null`
            );

            return districts.map(
                (d: { ubigeoId: string; distrito: string }) => ({
                    ubigeoId: d.ubigeoId.slice(4, 6),
                    distrito: d.distrito,
                })
            );
        } catch (error) {
            throw error;
        }
    }
}
