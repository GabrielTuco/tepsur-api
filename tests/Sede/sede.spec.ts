import { Application } from "express";
import request from "supertest";
import Server from "../../src/model/server";
import { AppDataSource } from "../../src/db/dataSource";

jest.useFakeTimers();

describe("Pruebas en sedes service", () => {
    let app: Application;
    let server: Server;

    beforeAll(async () => {
        server = new Server();
        server.listen();
        const dataSource = await AppDataSource.initialize();
        app = server.getApp;

        const loginResponse = await request(app)
            .post("/api/auth/login")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .send({ usuario: "70606804", password: "70606804" });
        console.log(loginResponse.body);
    }, 60000);

    test("401 - Should be return message of missing token", async () => {
        const response = await request(app).get("/api/sede").send().expect(401);
        console.log(response.statusCode);

        expect(response.statusCode).toBe(401);
        expect(response.body).toBeInstanceOf(Object);
    }, 30000);

    afterAll(async () => {
        await server.closeConnectionDB();
        server.stop();
    });
});

// test("200 - Should be return list of all sedes", async () => {
//     const response = await request(app).get("/api/sede").send().expect(200);

//     expect(response.statusCode).toBe(200);
//     expect(response.body).toBeInstanceOf(Array);
// });
