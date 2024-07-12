import ejs from "ejs";
import got from "got";
import path from "path";
import {
    readdirSync,
    readFileSync,
    writeFileSync,
    createWriteStream,
    existsSync,
    mkdirSync,
    lstatSync,
    cpSync,
    rmSync,
    renameSync,
} from "fs";
import Person from "./Person.js";
import { person } from "./PersonData.js";
import { dirname } from "path";

function createFolderIfNotExist(folder) {
    const destFolder = dirname(folder);
    if (!existsSync(destFolder)) mkdirSync(destFolder, { recursive: true });
}

async function write(filename, data, encoding = "utf8") {
    const dest = path.join(buildFolder, filename)
    createFolderIfNotExist(dest)
    if (/^https?:\/\//i.test(data)) {
        console.log(`Downloading '${data}' to '${filename}'`)
        await got.stream(data).pipe(createWriteStream(dest));
    } else {
        console.log(`Writing to '${filename}'`)
        return writeFileSync(dest, data, encoding);
    }
}

function cp(src, dest) {
    dest = path.join(buildFolder, dest);
    const isDir = lstatSync(src).isDirectory();
    createFolderIfNotExist(dest)
    console.log(isDir ? `Copying '${src}' content inside '${dest}'` : `Copying '${src}' to '${dest}'`)
    cpSync(src, dest, { recursive: isDir });
}

function mv(src, dest) {
    createFolderIfNotExist(dest)
    console.log(`Moving '${src}' to '${dest}'`)
    renameSync(src, dest);
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
write("/img/profile.jpeg", "https://demo.datengdong.com/img/profile.jpeg")
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
mv(path.join(buildFolder, "/images/mahkota.png"), path.join(buildFolder, "/themes/six/images/mahkota.png"))
