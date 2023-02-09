import app from "app";
import supertest from "supertest";
import { cleanDb } from "../helpers";

const api = supertest(app);

beforeEach(async () => await cleanDb());

describe("GET /consoles", () => {
    it("", async ()=>{
        
    })
});

describe("GET /consoles/:id", () => {});

describe("POST /consoles", () => {});
