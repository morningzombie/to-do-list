const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/todo_db"
);

client.connect();

const sync = async () => {
  const SQL = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  DROP TABLE IF EXISTS notes;

  CREATE TABLE notes(
    id UUID PRIMARY KEY default uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    CHECK (char_length(name)>0)
    );

  INSERT INTO notes (name) VALUES ('Take out trash');
  INSERT INTO notes (name) VALUES ('Meet hubby for dinner');
  INSERT INTO notes (name) VALUES ('Pick up toilet paper');
  `;

  await client.query(SQL);
};
const readNotes = async () => {
  return (await client.query("SELECT * FROM notes")).rows;
};

const createNote = async () => {
  const SQL = "INSERT INTO notes(text) values($1) returning *";
  return (await client.query(SQL, [name])).rows[0];
};

const deleteNote = async id => {
  const SQL = "DELETE FROM notes WHERE id = $1";
  await client.query(SQL, [id]);
};

module.exports = {
  sync,
  readNotes,
  createNote,
  deleteNote
};
