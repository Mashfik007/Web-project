const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

process.env.USE_CUSTOM_SERVER = "1";

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.env.PORT || 3000);
const app = next({ dev, hostname: "localhost", port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const httpServer = createServer((req, res) => {
    handle(req, res, parse(req.url, true));
  });

  const attach = globalThis.__attachChatSocket;
  if (typeof attach === "function") {
    await attach(httpServer);
  } else {
    console.warn("> Chat socket attach unavailable; live chat will not work");
  }

  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`> Ready on http://0.0.0.0:${port}`);
  });
});
