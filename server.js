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

app.get("/api/things", (req, res, next) => {
  db.readThings()
    .then(things => {
      res.send(things);
    })
    .catch(next);
});

app.put("/api/things/update/:id", (req, res, next) => {
  db.markComplete(req.params.id)
    .then(thing => {
      res.send(thing);
    })
    .catch(next);
});

app.post("/api/things", (req, res, next) => {
  db.createThing(req.body)
    .then(thing => {
      res.send(thing);
    })
    .catch(next);
});

app.delete('/api/things/:id', (req, res, next) => {
  db.deleteThing(req.params.id)
      .then(() => res.sendStatus(204))
      .catch(next);
});


// app.use((req, res, next) => {
//   next({
//     status: 404,
//     message: `Page not found for ${req.method} ${req.url}`
//   });
// });

// app.use((err, req, res, next) => {
//   res.status(err.status || 500).send({
//     message: err.message || JSON.stringify(err)
//   });
// });

const port = process.env.PORT || 8081;

db.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
