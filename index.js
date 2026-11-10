const mc = require("minecraft-protocol");
const http = require("http");

// Создаем веб-сервер на порту, который требует хостинг Render
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Bot is alive!\n");
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`[Сайт] Веб-сервер успешно запущен на порту ${PORT}`);
});

// Настройки подключения к твоему Атерносу
const serverIp = "lollyeyes.aternos.me";
const serverPort = 49780; 
const botName = "AternosBot";

function startBot() {
  console.log(`[Бот] Пробую зайти на ${serverIp}:${serverPort}...`);
  
  const client = mc.createClient({
    host: serverIp,
    port: serverPort,
    username: botName
  });

  let moveInterval;

  client.on("connect", () => {
    console.log("[Бот] УСПЕШНО ЗАШЕЛ НА СЕРВЕР И ДЕРЖИТ ОНЛАЙН!");
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
    console.log(`[Бот] Вышел из игры (${reason}). Перезаход через 30 сек...`);
    clearInterval(moveInterval);
    moveInterval = null;
    setTimeout(startBot, 30000);
  });

  client.on("error", (err) => {
    console.log("[Бот] Ошибка сети. Перезаход через 30 сек...");
    clearInterval(moveInterval);
    moveInterval = null;
    setTimeout(startBot, 30000);
  });
}

startBot();
