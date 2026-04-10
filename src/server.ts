import app from "./app";
//import { env } from "./config/environment";
import http from "http";
import https from "https";
import fs from "fs";
import { connectDB } from "./config/db";

import dotenv from 'dotenv';

dotenv.config();

const USE_SSL = process.env.USE_SSL === 'true';
const PORT = parseInt(process.env.PORT || '3000', 10);
const SECURE_PORT = parseInt(process.env.SECURE_PORT || '8400', 10);

let server: http.Server | https.Server;

if (USE_SSL) {
  try {
    const options: https.ServerOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH!),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH!),
    };
    server = https.createServer(options, app);
    console.log(`Attempting to start Secure Server on https://localhost:${SECURE_PORT}`);
  } catch (error) {
    console.error('Failed to load SSL certificates. Falling back to HTTP server.', error);
    server = http.createServer(app);
    console.log(`Starting HTTP Server on http://localhost:${PORT} due to SSL error.`);
  }
} else {
  server = http.createServer(app);
  console.log(`Starting HTTP Server on http://localhost:${PORT}`);
}

const startServer = async (): Promise<void> => {
  await connectDB();
  server.listen(USE_SSL ? SECURE_PORT : PORT, () => {
    if (USE_SSL) {
      console.log(`Secure Server running on https://localhost:${SECURE_PORT}`);
    } else {
      console.log(`Server running on http://localhost:${PORT}`);
    }
  });
};

startServer().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});