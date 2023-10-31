import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import NodeCache from "node-cache";

const token = "6929875979:AAFby2qtxXuOceiZzH3j8cpuv_vZbG75IkM";

const bot = new TelegramBot(token, { polling: true });
const cache = new NodeCache({ stdTTL: 300 });
const apiKey = "0d7f0074167484aea1ac4b73fdfcf8db";
const city = "Kryvyi Rih";

console.log("Bot started");

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Доброго дня! Оберіть дію в меню.", {
    reply_markup: {
      keyboard: [["Погода"], ["Курс валют"]],
      resize_keyboard: true,
    },
  });
});

bot.onText(/Погода/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Обеіть інтервал:", {
    reply_markup: {
      keyboard: [
        ["Кожні 3 години", "Кожні 6 годин"],
        ["Вітер"],
        ["Попередне меню"],
      ],
      resize_keyboard: true,
    },
  });
});

bot.onText(/Курс валют/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Оберіть валюту:", {
    reply_markup: {
      keyboard: [["USD", "EUR"], ["Попередне меню"]],
      resize_keyboard: true,
    },
  });
});

bot.onText(/Попередне меню/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Оберіть дію в меню.", {
    reply_markup: {
      keyboard: [["Погода"], ["Курс валют"]],
      resize_keyboard: true,
    },
  });
});

bot.onText(/Вітер/, (msg) => {
  sendWeather(msg);
});

bot.onText(/Кожні 3 години/, (msg) => {
  sendWeather(msg);
  weatherUpdate(msg, 3);
});

bot.onText(/Кожні 6 годин/, (msg) => {
  sendWeather(msg);
  weatherUpdate(msg, 6);
});

bot.onText(/USD/, (msg) => {
  sendCurrency(msg, "USD");
});

bot.onText(/EUR/, (msg) => {
  sendCurrency(msg, "EUR");
});

function sendWeather(msg) {
  const chatId = msg.chat.id;
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  try {
    axios.get(apiUrl).then((response) => {
      const forecasts = response.data.list;
      const weather = forecasts[0];

      const date = new Date(weather.dt * 1000);
      const temp = weather.main.temp;
      const tempCel = (temp - 273.15).toFixed(0);
      const wind = weather.wind.speed;
      if (msg.text === "Вітер") {
        const message = `Швидкість вітру у ${city}: ${wind}м/с`;
        bot.sendMessage(chatId, message);
      } else {
        const message =
          `Зараз погода у ${city}:\n\n` +
          `Температура повітря: ${tempCel}°C\n` +
          `Дата: ${date.toISOString()}\n\n` +
          `${msg.text} Вам буде надходити актуальний прогноз погоди`;

        bot.sendMessage(chatId, message);
      }
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

function sendCurrency(msg, currency) {
  const chatId = msg.chat.id;
  if (cache.has(currency)) {
    const rate = cache.get(currency);
    bot.sendMessage(chatId, `Курс ${currency} до UAH: ${rate}`);
  } else {
    fetchCurrency(chatId, currency);
  }
}
async function fetchCurrency(chatId, currency) {
  const apiUrl = "https://api.monobank.ua/bank/currency";

  try {
    const res = await axios.get(apiUrl);
    const rates = res.data;
    const sortCode = rates.find(
      (rate) =>
        rate.currencyCodeB === 980 && rate.currencyCodeA === getCode(currency)
    );
    if (sortCode) {
      const rate = sortCode.rateBuy;
      cache.set(currency, rate);
      bot.sendMessage(chatId, `Курс ${currency} до UAH: ${rate}`);
    } else {
      bot.sendMessage(chatId, "Не вдалося отримати курси валют.");
    }
  } catch (error) {
    bot.sendMessage(chatId, `Помилка: ${error}. Спробуйте пізніше`);
  }
}

function getCode(currency) {
  return currency === "USD" ? 840 : currency === "EUR" ? 978 : null;
}
