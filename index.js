const mc = require("minecraft-protocol");
const http = require("http");

// Создаем мини-сайт для хостинга Render, чтобы убрать ошибку Deploy failed
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Bot is running!\n");
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`[Сайт] Веб-сервер запущен на порту ${PORT}`);
});

function startBot() {
  console.log("[Бот] Пробую зайти на lollyeyes.aternos.me:49780...");
  
  const client = mc.createClient({
    host: "lollyeyes.aternos.me",
    port: 49780,
    username: "AternosBot"
  });

  let moveInterval;

  client.on("connect", () => {
    console.log("[Бот] УСПЕШНО ЗАШЕЛ НА СЕРВЕР!");
  });

  client.on("position", () => {
    if (!moveInterval) {
      moveInterval = setInterval(() => {
        if (client.position) {
          client.write("position", {
            x: client.position.x + (Math.random() - 0.5) * 0.05,
            y: client.position.y,
            z: client.position.z + (Math.random() - 0.5) * 0.05,
            onGround: true
          });
        }
      }, 5000);
    }
  });

  client.on("end", (reason) => {
    console.log(`[Бот] Вышел (${reason}). Ждем 30 секунд...`);
    clearInterval(moveInterval);
    moveInterval = null;
    setTimeout(startBot, 30000);
  });

  client.on("error", (err) => {
    console.log("[Бот] Ошибка связи. Ждем 30 секунд... ");
    clearInterval(moveInterval);
    moveInterval = null;
    setTimeout(startBot, 30000);
  });
}

startBot();
