const mc = require("minecraft-protocol");

if (process.argv.length < 3) {
  console.log("Используйте: node index.js <IP сервера>");
  process.exit(1);
}

const fullAddress = process.argv[2];
// Правильно разделяем IP и порт (например lollyeyes.aternos.me:49780)
const addressParts = fullAddress.split(':');
const serverHost = addressParts[0];
const serverPort = addressParts[1] ? parseInt(addressParts[1]) : 25565;

function startBot() {
  console.log(`[Бот] Подключаюсь к ${serverHost}:${serverPort}...`);
  
  const client = mc.createClient({
    host: serverHost,
    port: serverPort,
    username: "AternosBot"
  });

  let moveInterval;

  client.on("connect", () => {
    console.log("[Бот] Успешно зашел на сервер и держит онлайн!");
  });

  client.on("position", () => {
    if (!moveInterval) {
      moveInterval = setInterval(() => {
        if (client.position) {
          client.write("position", {
            x: client.position.x + (Math.random() - 0.5) * 0.1,
            y: client.position.y,
            z: client.position.z + (Math.random() - 0.5) * 0.1,
            onGround: true
          });
        }
      }, 4000);
    }
  });

  client.on("end", (reason) => {
    console.log(`[Бот] Отключился (${reason}). Ждем 60 секунд перед перезаходом...`);
    clearInterval(moveInterval);
    moveInterval = null;
    setTimeout(startBot, 60000);
  });

  client.on("error", (err) => {
    console.log("[Бот] Ошибка подключения. Ждем 60 секунд перед перезаходом...");
    clearInterval(moveInterval);
    moveInterval = null;
    setTimeout(startBot, 60000);
  });
}

startBot();
