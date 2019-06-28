const express = require("express");

const server = express();

server.use(express.json());

//localhost:3000/teste

//Query params = ?teste=1
//Route params = /user/1
// Request body = {"name": "Teste", "Empresa" : 'teste'}

//CRUD - Create,Read, Update, Delete

const users = ["Diego", "Claudio", "Robson"];

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Metodo ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd("Request");
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  req.user = user;
  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }
  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  return res.json(req.user);
});

server.get("/users/id/:id", (req, res) => {
  const { id } = req.params;
  return res.json({
    message: `Buscando usuario com ID: ${id} `
  });
});

server.get("/users", (req, res) => {
  const nome = req.query.nome;
  return res.json({
    message: `Buscando usuario com nome: ${nome}`
  });
});

server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);

  return res.json(users);
});

server.put("/users/:index", checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);

  return res.json(users);
});

server.listen(3000);
