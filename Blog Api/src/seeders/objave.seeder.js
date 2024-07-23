"use strict";
exports.__esModule = true;
exports.uspostaviKonekciju = void 0;
/*==== UPIS OBJAVE U TABELI OBJAVE, I U SVIM TBEELAMA VZA *(TAGOVI, FOREEIGNKEY GE IMAM OD USEERA*) ====*/
var mysql = require("mysql2");
var mysqlPool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "blog_diplomski",
    connectionLimit: 5
});
function uspostaviKonekciju() {
    return mysqlPool;
}
exports.uspostaviKonekciju = uspostaviKonekciju;
var seederObjave = [
    {
        naslov: "Kako pripremiti dobar ručak",
        URLNaslovneSlike: "http://localhost:3002/images/2022-06-23T21-21-55.798Z.jpg",
        kratakOpis: "Spremanje dobrog ručka koji ne goji",
        sadrzaj: "\n            <div>\n                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo, possimus!</p>\n                <p>\n                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt iusto voluptatem quis. \n                    Illum inventore, omnis voluptatibus magnam deleniti veniam enim.\n                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt iusto voluptatem quis. \n                    Illum inventore, omnis voluptatibus magnam deleniti veniam enim.\n                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt iusto voluptatem quis. \n                    Illum inventore, omnis voluptatibus magnam deleniti veniam enim.\n                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt iusto voluptatem quis. \n                    Illum inventore, omnis voluptatibus magnam deleniti veniam enim.\n                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt iusto voluptatem quis. \n                    Illum inventore, omnis voluptatibus magnam deleniti veniam enim.\n                </p>\n                <figure>\n                    <img src=\"http://localhost:3002/images/2022-03-07T23-48-56.703Z.jpg\"/>\n                    <figcaption>\n                        Lorem ipsum\n                    </figcaption>\n                </figure>\n                <p>\n                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. \n                    Officiis aperiam ducimus similique dolore odio libero quasi, nihil facilis! \n                    Deleniti a iure cum repellendus nihil veritatis qui enim sunt earum dolorem.\n                    Officiis aperiam ducimus similique dolore odio libero quasi, nihil facilis! \n                    Deleniti a iure cum repellendus nihil veritatis qui enim sunt earum dolorem.\n                </p>\n                <p>\n                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. \n                    Cumque vero labore molestiae! Tenetur quasi, rerum deleniti accusamus beatae culpa? \n                    Quam architecto at, praesentium quos labore officia molestiae amet? \n                    Excepturi molestias ipsum veritatis modi minus nemo iure, \n                    ut ullam ex ad possimus provident eum quam nam dolorem atque \n                    cupiditate quia labore pariatur consequuntur! \n                    Saepe magni, ratione delectus nulla maxime impedit? Beatae.\n                </p>\n            </div>\n        ",
        id_autora: 1,
        datumPisanja: "2022-1-22"
    }
];
seederObjave.forEach(function (objava) {
    var upit = "INSERT INTO objave(naslov, URLNaslovneSlike, kratakOpis, sadrzaj, id_autora, datumPisanja) \n    VALUES (?, ?, ?, ?, ?, ?);";
    var nizParametara = [
        objava.naslov,
        objava.URLNaslovneSlike,
        objava.kratakOpis,
        objava.sadrzaj,
        objava.id_autora,
        objava.datumPisanja
    ];
    var konekcija = uspostaviKonekciju();
    konekcija.query(upit, nizParametara, function (greska, rezultat) {
        if (greska) {
            console.error(greska);
        }
        else {
            console.log(rezultat);
        }
    });
});
