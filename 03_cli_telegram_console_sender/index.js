import { program } from "commander";
import TelegramBot from "node-telegram-bot-api";
import fs from "node:fs";

const token = "6929875979:AAFby2qtxXuOceiZzH3j8cpuv_vZbG75IkM";

const bot = new TelegramBot(token, { polling: true });

async function startProg() {
  console.log(
    "Telegram bot is started. Please go to the Telegram and press /start"
  );
  bot.setMyCommands([
    { command: "/start", description: "Start" },
    { command: "/reg", description: "Register me" },
  ]);

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    console.log(`New user ${msg.from.first_name} connected`);
    bot.sendMessage(
      chatId,
      `Привіт ${msg.from.first_name} Тут будуть зберігатись твої записи, для реестрації натисни /reg`
    );
  });

  bot.onText(/\/reg/, async (msg) => {
    const chatId = msg.chat.id;

    const userData = { chatId: chatId };
    fs.writeFile("user.json", JSON.stringify(userData, null, 2), (e) => {
      if (e) {
        console.error("Error to write file");
      }
      console.log(`New user ${msg.from.first_name} registrated`);
    });
    bot.sendMessage(chatId, `${msg.from.first_name} Ви зареестровані)`);
    return setTimeout(() => {
      process.exit(0);
    }, 5000);
  });
}

const readFile = fs.readFileSync("user.json", "utf8");
const data = JSON.parse(readFile);
if (data.chatId !== null) {
  program.version("1.0.0").description("Telegram Console Sender");
  program
    .command("send-message <message>")
    .description("Send text message ")
    .action(async (message) => {
      await bot.sendMessage(data.chatId, message);
      process.exit(0);
    });

  program
    .command("send-photo <photoPath>")
    .description("Send photo")
    .action(async (photoPath) => {
      const photo = fs.readFileSync(photoPath);
      await bot.sendPhoto(data.chatId, photo);
      process.exit(0);
    });

  program.parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
} else {
  startProg();
}
