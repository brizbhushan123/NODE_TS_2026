import express from "express";
import cors from "cors";
import candidate from "./routes/candidate.routes";
import admin from "./routes/admin.routes";
import { notFound } from "./middlewares/notFound.middleware";
import  errorHandler  from "./middlewares/error.middleware";
import { contextMiddleware } from "./middlewares/context.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(contextMiddleware);

app.use("/api/candidate", candidate);
//app.use("/api/proctor", proctor);
app.use("/api/admin", admin);

app.use(notFound);
app.use(errorHandler);

export default app;