import { SedeService } from '../../../src/Sede/services/sede.service';


describe("Pruebas en sedes service",()=>{
    const sedeService = new SedeService()
    test("Return list of all sedes",async ()=>{
        const sedes = await sedeService.listAll()

        expect(sedes).toBe(Array)
    })
})