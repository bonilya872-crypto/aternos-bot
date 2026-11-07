const mc = require("minecraft-protocol");

function startBot() {
  console.log("[Бот] Подключаюсь к lollyeyes.aternos.me:49780...");
  
  const client = mc.createClient({
    host: "lollyeyes.aternos.me",
    port: 49780,
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
