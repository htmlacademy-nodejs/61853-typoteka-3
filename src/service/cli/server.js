'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {HttpCode} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

const express = require(`express`);

const app = express();
app.use(express.json());

app.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILENAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (error) {
    res.json([]);
  }
});

app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(`Not Found`));


module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      app.listen(port, (error) => {
        if (error) {
          return console.error(`Ошибка при создании сервера`, error);
        }

        return console.info(chalk.green(`Ожидаю соединений на ${port}`));
      });
    } catch (error) {
      console.error(`Произошла ошибка: ${error.message}`);
      process.exit(1);
    }
  }
};
