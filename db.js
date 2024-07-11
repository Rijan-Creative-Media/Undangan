// db.js
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const adapter = new JSONFile("db_comments.json"); // Specify the file where the data will be stored
export const db = new Low(adapter, []);

db.read();

// Example functions to interact with the database
export const getComments = () => {
  return db.data;
};

export const addComment = ({ name, attendance, text, image }) => {
  db.data.push({
    n: name,
    a: attendance,
    t: text,
    i: image,
    d: +new Date(),
  });
  db.write();
};
