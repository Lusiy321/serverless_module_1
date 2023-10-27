import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

const token = "6929875979:AAFby2qtxXuOceiZzH3j8cpuv_vZbG75IkM";

const bot = new TelegramBot(token, { polling: true });

const apiKey = "0d7f0074167484aea1ac4b73fdfcf8db";
const city = "Kyiv";

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Choose a weather forecast interval:", {
    reply_markup: {
      keyboard: [["Forecast in Kyiv"]],
      resize_keyboard: true,
    },
  });
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
});

bot.onText(/6 hours/, (msg) => {
  sendWeather(msg, 6);
});

function sendWeather(msg, interval) {
  const chatId = msg.chat.id;
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  axios
    .get(apiUrl)
    .then((response) => {
      const forecasts = response.data.list.filter(
        (item, index) => index % (interval / 3) === 0
      );

      let message = `Weather forecast for a ${city} every ${interval} hours:\n\n`;
      forecasts.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        const temp = forecast.main.temp;
        const description = forecast.weather[0].description;

        message += `Date: ${date.toISOString()}\n`;
        message += `Temperature: ${temp}°C\n`;
        message += `Description: ${description}\n\n`;
      });

      bot.sendMessage(chatId, message);
    })
    .catch((e) => {
      bot.sendMessage(chatId, `Error ${e}`);
    });
}
