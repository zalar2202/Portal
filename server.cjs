// server.cjs (CommonJS)
const http = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

async function main() {
  await app.prepare();

  const server = http.createServer((req, res) => handle(req, res));

  const io = new Server(server, {
    path: "/socket.io",
    transports: ["polling", "websocket"],
    allowEIO3: true,
  });

  io.on("connection", (socket) => {
    socket.emit("hello", { ok: true, at: new Date().toISOString() });
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[web] Ready on http://0.0.0.0:${PORT} (NODE_ENV=${process.env.NODE_ENV})`);
  });
}

main().catch((err) => {
  console.error("Fatal server error:", err);
  process.exit(1);
});
