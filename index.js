import got from "got";
import express from "express";
import bodyParser from "body-parser";
import Person from "./Person.js";
import * as db from "./db.js";
import morgan from "morgan"
// import { createWriteStream } from "fs";

const theme = "six";

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'))

app.get(["/images/:image", "/themes/:theme/images/:image"], (req, res, next) => {
  res.redirect('/images/blue/' + req.params.image)
  // const file = createWriteStream(`./public/images/${req.params.image}`);
  // const src = got.stream(
  //   `https://demo.datengdong.com/themes/${theme}/images/${req.params.image}`,
  // );
  // src.on("data", (data) => file.write(data));
  // src.on("end", () => file.end());
  // src.pipe(res);
});
app.get("/ustyle.css", (req, res) => {
  got.stream(`https://demo.datengdong.com/themes/${theme}/style.css`).pipe(res);
});
app.get("/img/profile.jpeg", (req, res) => {
  got.stream(`https://demo.datengdong.com/img/profile.jpeg`).pipe(res);
});
app.use(express.static("public"));
const Abuya = new Person("", "KH. Mahfudz Syaubari, MA");
const person = [
  {
    man: new Person("Najah", "Muhammad Najah Mahfudz", {
      father: Abuya,
      mother: new Person("", "Nyai Hj. Shofiyah"),
    }),
    woman: new Person("Nadya", "Nadya Ummu Kultsum", {
      father: new Person("", "Drs. KH Muhammad Makmun"),
      mother: new Person("", "Nyai Hj. Qais Muhayyam"),
    }),
  },
  {
    man: new Person("Zain", "Zain Mahfudz", {
      father: Abuya,
      mother: new Person("", "Nyai Hj. Endang Nur Rohmawati"),
    }),
    woman: new Person("Nafisa", "Nafisa Alyana", {
      father: new Person("", "Prof. Dr. H. M. Nizarul Alim"),
      mother: new Person("", "Nyai Hj. Nina Hendriana"),
    }),
  },
];
app.get("/", (req, res) => {
  res.render("index", {
    date: "Ahad, 18 Agustus 2024",
    desc: "Assalamualaikum",
    guest: new Person(req.query.guest, req.query.guest, {
      from: req.query.from,
    }),
    person: person.map(Object),
  });
});

app.get("/comment", async (req, res) => {
  const values = db.getComments();
  res.json(values);
});

app.post("/comment", async (req, res) => {
  console.log(req.body);
  if (!req.body.name) return sendErr(res, "name");
  if (!req.body.greet) return sendErr(res, "greet");
  if (!req.body.attendance) return sendErr(res, "attendance");

  db.addComment({
    name: req.body.name,
    text: req.body.greet,
    img: req.body.image,
    attendance: req.body.attendance,
  });
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Express server initialized");
});

function sendErr(res, name) {
  return res.status(401).json({
    param: name,
    message: `${name} parameters not valid.`,
  });
}
