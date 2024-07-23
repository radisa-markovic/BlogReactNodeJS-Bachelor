var mysql = require("mysql2");
var mysqlPool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    // database: "djole",
    connectionLimit: 5
});
var nazivBaze = "djole";
var upit = "CREATE DATABASE IF NOT EXISTS ".concat(nazivBaze);
izvrsiUpit(upit, "")
    .then(function () {
    upit = "USE ".concat(nazivBaze, ";");
    return izvrsiUpit(upit, "");
})
    .then(function () {
    upit = "CREATE TABLE IF NOT EXISTS korisnici (\n\t\tid INT PRIMARY KEY AUTO_INCREMENT,\n\t\tkorisnickoIme VARCHAR(255) NOT NULL UNIQUE,\n\t\tlozinka VARCHAR(255) NOT NULL,\n\t\tadmin_status BIT(1) DEFAULT b'0'   \n\t);";
    return izvrsiUpit(upit, "korisnici");
})
    .then(function () {
    upit = "CREATE TABLE IF NOT EXISTS objave (\n\t\tid INT PRIMARY KEY AUTO_INCREMENT,\n\t\tnaslov VARCHAR(255) NOT NULL,\n\t\tsadrzaj TEXT NOT NULL,\n\t\tid_autora INT,\n\t\tdatumPisanja DATE,\n\t\tkratakOpis TEXT,\n\t\tURLNaslovneSlike TEXT,\n\t\tFOREIGN KEY(id_autora) REFERENCES korisnici(id)\n\t\tON DELETE CASCADE\n\t\t);\n\t";
    return izvrsiUpit(upit, "objave");
})
    .then(function () {
    upit = "CREATE TABLE IF NOT EXISTS tagovi(\n\t\tid int PRIMARY KEY AUTO_INCREMENT,\n\t\tnaziv VARCHAR(255) UNIQUE\n\t);";
    return izvrsiUpit(upit, "tagovi");
})
    .then(function () {
    upit = "CREATE TABLE IF NOT EXISTS tagovi_na_objavama(\n\t\tidTaga int,\n\t\tidObjave int,\n\t\tPRIMARY KEY(idTaga, idObjave),\n\t\tFOREIGN KEY(idTaga) REFERENCES tagovi(id),\n\t\tFOREIGN KEY(idObjave) REFERENCES objave(id)\n\t);";
    return izvrsiUpit(upit, "tagovi_na_objavama");
})
    .then(function () {
    upit = "\n\tCREATE TABLE IF NOT EXISTS komentari(\n\t\tid int PRIMARY KEY AUTO_INCREMENT,\n\t\tidAutora int,\n\t\tidObjave int,\n\t\tsadrzaj TEXT NOT NULL,\t\n\t\tFOREIGN KEY(idAutora) REFERENCES korisnici(id),\n\t\tFOREIGN KEY(idObjave) REFERENCES objave(id)\n\t);\n\t";
    return izvrsiUpit(upit, "komentari");
})
    .then(function () {
    upit = "CREATE TABLE IF NOT EXISTS reakcije_na_objavama(\n\t\tidKorisnika INT,\n\t\tidObjave INT,\n\t\tlajk BIT(1),\n\t    PRIMARY KEY(idKorisnika, idObjave),\n\t    FOREIGN KEY(idKorisnika) REFERENCES korisnici(id),\n\t\tFOREIGN KEY(idObjave) REFERENCES objave(id)\n\t);";
    return izvrsiUpit(upit, "reakcije_na_objavama");
})
    .then(function () {
    upit = "CREATE TABLE IF NOT EXISTS lajkovi_na_komentarima(\n\t\tidKorisnika INT,\n\t\tidKomentara INT,\n\t\tlajk BIT(1),\n\t\tFOREIGN KEY(idKorisnika) REFERENCES korisnici(id),\n\t\tFOREIGN KEY(idKomentara) REFERENCES komentari(id)\n\t);";
    return izvrsiUpit(upit, "lajkovi_na_komentarima");
})
    .then(function () {
    upit = "\n\tCREATE TABLE IF NOT EXISTS poruke(\n\t\t\tid INT AUTO_INCREMENT,\n\t\t\timePosiljaoca VARCHAR(50),\n\t\t\timePrimaoca VARCHAR(50),\n\t\t\tnaslov VARCHAR(30) NOT NULL,\n\t\t\tsadrzaj TEXT NOT NULL,\n\t\t\tdatumSlanja DATE NOT NULL,\n\t\t\tprocitana BIT(1),\n\t\t\tPRIMARY KEY(id),\n\t\t\tFOREIGN KEY(imePosiljaoca) REFERENCES korisnici(korisnickoIme),\n\t\t\tFOREIGN KEY(imePrimaoca) REFERENCES korisnici(korisnickoIme)\n\t\t);\n\t";
    return izvrsiUpit(upit, "poruke");
})
    .then(function () {
    upit = "\n\tCREATE TABLE IF NOT EXISTS banovaniKorisnici(\n\t\t\tid INT AUTO_INCREMENT, /*surogat kljuc*/\n\t\t\tidKorisnika INT,\n\t\t\trazlog TEXT NOT NULL,\n\t\t\tPRIMARY KEY(id),\n\t\t\tFOREIGN KEY(idKorisnika) REFERENCES korisnici(id)\n\t\t);\n\t";
    return izvrsiUpit(upit, "banovaniKorisnici");
})
    .then(function () {
    upit = "\n\tCREATE TABLE IF NOT EXISTS slike_po_objavama(\n\t\t\tid int PRIMARY KEY AUTO_INCREMENT,\n\t\t\tidObjave int,\n\t\t\turlSlike TEXT,\n\t\t\t\n\t\t\tCONSTRAINT fk_idObjave\n\t\t\tFOREIGN KEY (idObjave)\n\t\t\tREFERENCES objave (id)\n\t\t\tON DELETE CASCADE\n\t\t);\n\t";
    return izvrsiUpit(upit, "slike_po_objavama");
})
    .then(function () {
    upit = "\n\tCREATE TABLE IF NOT EXISTS profilne_slike(\n\t\t\tid int PRIMARY KEY AUTO_INCREMENT,\n\t\t\tidKorisnika int,\n\t\t\turlProfilneSlike TEXT,\n\t\t\t\n\t\t\tCONSTRAINT fk_idKorisnikaProfilneSlike\n\t\t\tFOREIGN KEY (idKorisnika)\n\t\t\tREFERENCES korisnici (id)\n\t\t\tON DELETE CASCADE\n\t\t);\n\t";
    return izvrsiUpit(upit, "profilne_slike");
})
    .then(function () {
    upit = "\n\tCREATE TABLE IF NOT EXISTS skladisteZaSlike(\n\t\tid int PRIMARY KEY AUTO_INCREMENT,\n\t\turlSlike TEXT NOT NULL\n\t);\n\t";
    return izvrsiUpit(upit, "skladisteZaSlike");
})
    .then(function () {
    upit = "\n\tCREATE TABLE IF NOT EXISTS mejloviPretplatnika(\n\t\tid int PRIMARY KEY AUTO_INCREMENT,\n\t\temail VARCHAR(255) NOT NULL UNIQUE\n\t);\n\t";
    return izvrsiUpit(upit, "mejloviPretplatnika");
})
    .then(function () {
    mysqlPool.end();
})["catch"](function (greska) {
    console.error(greska);
});
function izvrsiUpit(upit, nazivTabele) {
    return new Promise(function (resolve, reject) {
        mysqlPool.query(upit, function (greska, rezultat) {
            if (greska) {
                reject(greska);
            }
            else {
                console.log("Kreirana tabela: " + nazivTabele);
                resolve(rezultat);
            }
        });
    });
}
