import express from "express";
import http from "http";
import { bootstrap } from "./src/bootstrap.js";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import cors from "cors";
import path from "path";
import {
  getIo,
  initializeSocket,
  socketIoMiddleware,
} from "./websocket/webSocket.js";
import { dbConnection } from "./db/dbConnection.js";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initializeSocket(server);
app.use(socketIoMiddleware(getIo()));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

dbConnection();
bootstrap(app);

server.listen(port, () => console.log(`server listening on port ${port}!`));
