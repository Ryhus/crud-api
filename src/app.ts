import "dotenv/config";
import { startServer } from "./server.js";

const PORT = Number(process.env.PORT) || 4000;
startServer(PORT);
