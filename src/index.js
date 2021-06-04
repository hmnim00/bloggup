const express = require('express');
const server = require('./config/server');

const app = server(express());

app.listen(app.get('port'), () => {
  console.log(`Servidor en el puerto ${app.get('port')}`);
});