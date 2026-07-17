import "dotenv/config";
import http from "http";
import { initSocket } from "./socket";

const port = process.env.PORT || 4000;
const httpServer = http.createServer();

initSocket(httpServer);

httpServer.listen(port, () => {
  console.log(`Socket server running on PORT: ${port}`);
});