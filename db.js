const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/todo_db"
);

client.connect();

const sync = async () => {
  const SQL = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  DROP TABLE IF EXISTS things;

  CREATE TABLE things(
      id UUID PRIMARY KEY default uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      completed boolean NOT NULL default FALSE,
      CHECK (char_length(name)>0)
      );
      INSERT INTO things (name) VALUES ('Take out trash');
      INSERT INTO things (name) VALUES ('Meet hubby for dinner');
      INSERT INTO things (name) VALUES ('Pick up toilet paper');
    
  `;

  await client.query(SQL);
  }

const createThing = async ({ name }) => {
  return (
    await client.query("INSERT INTO things(name) VALUES ($1) returning *", [name])
  ).rows[0];
};


const readThings = async () => {
  return (await client.query("SELECT * FROM things")).rows;
};


const deleteThing = async (id) => {
  const SQL = 'DELETE FROM things WHERE id = $1';
  await client.query(SQL, [id]);
};
const markComplete = async (thing) => {
  const SQL = 'UPDATE things SET completed = !completed WHERE id = $1';  
  await client.query(SQL, [thing]);
  console.log("ID", thing)

};

// const markComplete = id => {
// console.log("ID", id)
    // things.map(thing => {
    //   if (thing.id === id) {
    //     thing.completed = !thing.completed;
    //     console.log("COMPLETED", thing.completed)
    //   }
    //   return thing;
    // })
  // }


module.exports = {
  sync,
  createThing,
  readThings,
  deleteThing,
  markComplete
};
