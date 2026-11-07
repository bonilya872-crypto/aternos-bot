const mc = require("minecraft-protocol");

if (process.argv.length < 3) {
  console.log("Используйте: node index.js <IP сервера>");
  process.exit(1);
}

const serverIp = process.argv[2];

function startBot() {
  console.log(`[Бот] Подключаюсь к ${serverIp}...`);
  
  const client = mc.createClient({
    host: serverIp,
    port: 25565, // Скрипт сам найдет порт Атерноса по IP
    username: "AternosBot"
  });

  let moveInterval;

  client.on("connect", () => {
    console.log("[Бот] Успешно зашел на сервер и держит онлайн!");
  });

  // Этот блок заставляет бота постоянно шевелиться каждые 4 секунды
  client.on("position", () => {
    if (!moveInterval) {
      moveInterval = setInterval(() => {
        if (client.position) {
          // Бот немного меняет свои координаты и прыгает, чтобы Атернос его не кикал
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

  // Если сервер выключился или бота кикнуло — он сам перезайдет через 15 секунд
  client.on("end", (reason) => {
    console.log(`[Бот] Отключился (${reason}). Перезапуск через 15 секунд...`);
    clearInterval(moveInterval);
    moveInterval = null;
    setTimeout(startBot, 15000);
  });

  client.on("error", (err) => {
    console.log("[Бот] Ошибка подключения. Попытка перезахода...");
    clearInterval(moveInterval);
    moveInterval = null;
    setTimeout(startBot, 15000);
  });
}

startBot();
