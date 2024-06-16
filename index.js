const express = require('express');
require('./db/mongoose');
const orderRouter = require('./routers/order');
const productsRouter = require('./routers/routerProducts');
const checkRouter = require('./routers/check');
const socketConfig = require('./socket/socket');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(orderRouter);
app.use(productsRouter);
app.use(checkRouter);

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

socketConfig.init(server);