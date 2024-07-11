import ejs from "ejs";
import path from "path";
import {
    readdirSync,
    writeFileSync,
    existsSync,
    mkdirSync,
    cpSync,
    lstatSync,
} from "fs";
import Person from "./Person.js";
import { person } from "./PersonData.js";
import { dirname } from "path";

function write(filename, data, encoding = "utf8") {
    return writeFileSync(path.join(buildFolder, filename), data, encoding);
}

function cp(src, dest) {
    dest = path.join(buildFolder, dest);
    const isDir = lstatSync(src).isDirectory();
    const destFolder = dirname(dest);
    if (!existsSync(destFolder)) mkdirSync(destFolder, { recursive: true });
    console.log({src, dest, destFolder})
    cpSync(src, isDir ? destFolder : dest, { recursive: isDir });
}

const buildFolder = "./gh-pages";
const data = {
    date: "Ahad, 18 Agustus 2024",
    desc: "Assalamualaikum",
    guest: new Person("tamu_nama", "tamu_nama", {
        from: "tamu_asal",
    }),
    person,
};
const html = ejs.render("./views/index.ejs", data);
write("index.html", html);
for (let dir of readdirSync("./public")) {
    console.log(dir);
    if (dir == "images") cp(path.join("./public/", dir, "blue"), dir);
    else cp(path.join("./public", dir), dir);
}
