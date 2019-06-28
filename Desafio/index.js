const express = require("express");
const server = express();
server.use(express.json());
let numberOfRequests = 0;
const projects = [];
server.use(logRequests);

//Insert new data
server.post("/projects", checkExistentIdInArray, (req, res) => {
  const {
    id,
    title,
    tasks: []
  } = req.body;
  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

//Get all data
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Change data based on id
server.put(
  "/projects/:id",
  returnIndexOfArrayFromId,
  checkProjectExists,
  (req, res) => {
    const { title } = req.body;
    projects[req.indexArray].title = title;
    return res.json(projects[req.indexArray]);
  }
);

// used only to throw error, in case ID is not provided
server.put("/projects/", (req, res) => {
  return checkIdExists(res);
});

server.delete(
  "/projects/:id",
  returnIndexOfArrayFromId,
  checkProjectExists,
  (req, res) => {
    projects.splice(req.indexArray, 1);
    return res.json(projects);
  }
);
server.delete("/projects/", (req, res) => {
  return checkIdExists(res);
});

//Tasks
server.post(
  "/projects/:id/tasks",
  returnIndexOfArrayFromId,
  checkProjectExists,
  (req, res) => {
    const { title } = req.body;
    projects[req.indexArray].tasks.push({ title });
    return res.json(projects);
  }
);
server.post("/projects/tasks", (req, res) => {
  return checkIdExists(res);
});
server.post("/projects//tasks", (req, res) => {
  return checkIdExists(res);
});
server.post(
  "/projects/tasks/:id",
  returnIndexOfArrayFromId,
  checkProjectExists,
  (req, res) => {
    const { title } = req.body;
    projects[req.indexArray].tasks.push({ title });
    return res.json(projects);
  }
);

//Function to return the indexArray from params.ID, if existent
function returnIndexOfArrayFromId(req, res, next) {
  const { id } = req.params;
  req.indexArray = projects.findIndex(p => p.id === id);
  return next();
}

//Function to check if the ID is existent
function checkIdExists(res) {
  return res.status(400).json({ error: "id is required" });
}

//Function to check if an existent ID exists, returns status 400 if true
function checkExistentIdInArray(req, res, next) {
  // try {
  //   const { id } = projects.find(x => x.id == req.body.id).id;
  // } catch {
  //   return next();
  // }
  const project = projects.find(x => x.id === req.body.id);
  if (project) {
    return res
      .status(400)
      .json({ error: "Project already existent, unable to proceed!" });
  }
  return next();
}

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Requisition number: ${numberOfRequests}`);

  return next();
}

server.listen(3333);
