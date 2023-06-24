import { Application } from "express";
import server from "../../src/index";
import request from "supertest";

describe("Pruebas en sedes service", () => {
    let app: Application;

    beforeAll(async () => {
        await server.connectDB();
        app = server.getApp;
    });
    test("200 - Should be return list of all sedes", async () => {
        const response = await request(app).get("/api/sede").send().expect(200);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    afterAll(async () => {
        await server.closeConnectionDB();
        server.stop();
    });
});
