const express = require("express");
const app = express();
const path = require("path");
const db = require("./db");
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

//GET, POST, DELETE for /api/notes

app.get("/api/notes", (req, res, next) => {
  db.readNotes()
    .then(notes => {
      console.log("USERS", notes);
      res.send(notes);
    })
    .catch(next);
});
app.post("/api/notes", (req, res, next) => {
  db.createNote(req.body)
    .then(note => res.send(note))
    .catch(next);
});
app.delete("/api/notes/:id", (req, res, next) => {
  db.deleteNote(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});
//GET, POST, DELETE for /api/books

//ERROR: new row for relation "books" violates check constraint "books_name_check"

app.use((req, res, next) => {
  next({
    status: 404,
    message: `Page not found for ${req.method} ${req.url}`
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    message: err.message || JSON.stringify(err)
  });
});

const port = process.env.PORT || 3000;

db.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
