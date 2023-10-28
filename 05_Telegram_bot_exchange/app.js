import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

const token = "6929875979:AAFby2qtxXuOceiZzH3j8cpuv_vZbG75IkM";

const bot = new TelegramBot(token, { polling: true });

const apiKey = "0d7f0074167484aea1ac4b73fdfcf8db";
const city = "Kyiv";
let interval = 3;
console.log("Bot started");

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Hello! Clik to the button 'Forecast in Kyiv' and choose a weather forecast interval on keyboard.",
    {
      reply_markup: {
        keyboard: [["Forecast in Kyiv"]],
        resize_keyboard: true,
      },
    }
  );
});

bot.onText(/Forecast in Kyiv/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Select the interval:", {
    reply_markup: {
      keyboard: [["3 hours", "6 hours"]],
      resize_keyboard: true,
    },
  });
});

bot.onText(/3 hours/, (msg) => {
  sendWeather(msg, 3);
  weatherUpdate(msg, 3);
});

bot.onText(/6 hours/, (msg) => {
  sendWeather(msg, 6);
  interval = 6;
  weatherUpdate(msg, 6);
});

function sendWeather(msg, int) {
  const chatId = msg.chat.id;
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  try {
    axios.get(apiUrl).then((response) => {
      const forecasts = response.data.list;
      const weather = forecasts[0];

      const date = new Date(weather.dt * 1000);
      const temp = weather.main.temp;
      const tempCel = (temp - 273.15).toFixed(0);
      const description = weather.weather[0].description;

      const message =
        `Current weather in ${city}:\n\n` +
        `Temperature: ${tempCel}°C\n` +
        `Date: ${date.toISOString()}\n` +
        `Description: ${description}\n`;

      bot.sendMessage(chatId, message);
    });
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
}

function weatherUpdate(msg, interval) {
  setTimeout(() => {
    sendWeather(msg, interval);
    weatherUpdate(msg, interval);
  }, interval * 60 * 60 * 1000);
}
