import ejs from "ejs";
import path from "path";
import {
    readdirSync,
    readFileSync,
    writeFileSync,
    existsSync,
    mkdirSync,
    cpSync,
    lstatSync,
    rmSync,
    unlinkSync,
} from "fs";
import Person from "./Person.js";
import { person } from "./PersonData.js";
import { dirname } from "path";

function write(filename, data, encoding = "utf8") {
    console.log(`Writing to '${filename}'`)
    return writeFileSync(path.join(buildFolder, filename), data, encoding);
}

function cp(src, dest) {
    dest = path.join(buildFolder, dest);
    const isDir = lstatSync(src).isDirectory();
    const destFolder = dirname(dest);
    if (!existsSync(destFolder)) mkdirSync(destFolder, { recursive: true });
    console.log(isDir ? `Copying '${src}' content inside '${dest}'` : `Copying '${src}' to '${dest}'`)
    cpSync(src, dest, { recursive: isDir });
}

function cleanFolder(folder) {
    rmSync(folder, { recursive: true, force: true })
    mkdirSync(folder)
}

const buildFolder = "./docs";
const data = {
    date: "Ahad, 18 Agustus 2024",
    desc: "Assalamualaikum",
    guest: new Person("tamu_nama", "tamu_nama", {
        from: "tamu_asal",
    }),
    person,
};
const html = ejs.render(readFileSync("./views/index.ejs", "utf8"), data);

cleanFolder(buildFolder)
write("index.html", html);
for (let dir of readdirSync("./public")) {
    console.log(dir);
    switch (dir) {
        case "images":
            cp(path.join("./public/", dir, "blue"), dir);
            break
        default:
            cp(path.join("./public", dir), dir);
    }
}
