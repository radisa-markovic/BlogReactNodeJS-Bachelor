/*==== UPIS OBJAVE U TABELI OBJAVE, I U SVIM TBEELAMA VZA *(TAGOVI, FOREEIGNKEY GE IMAM OD USEERA*) ====*/
const mysql = require("mysql2");
/*=> id je auto_increment, to nee navodim u insertt into*/
interface ObjavaSeeder
{
    naslov: string,
    URLNaslovneSlike: string,
    kratakOpis: string,
    sadrzaj: string,
    id_autora: number,
    datumPisanja: string
}

const mysqlPool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "blog_diplomski",
    connectionLimit: 5
});

export function uspostaviKonekciju()
{
    return mysqlPool;
}

const seederObjave: ObjavaSeeder[] = [
    {
        naslov: "Kako pripremiti dobar ručak",
        URLNaslovneSlike: "http://localhost:3002/images/2022-06-23T21-21-55.798Z.jpg",
        kratakOpis: "Spremanje dobrog ručka koji ne goji",
        sadrzaj: `
            <div>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo, possimus!</p>
                <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt iusto voluptatem quis. 
                    Illum inventore, omnis voluptatibus magnam deleniti veniam enim.
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt iusto voluptatem quis. 
                    Illum inventore, omnis voluptatibus magnam deleniti veniam enim.
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt iusto voluptatem quis. 
                    Illum inventore, omnis voluptatibus magnam deleniti veniam enim.
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt iusto voluptatem quis. 
                    Illum inventore, omnis voluptatibus magnam deleniti veniam enim.
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt iusto voluptatem quis. 
                    Illum inventore, omnis voluptatibus magnam deleniti veniam enim.
                </p>
                <figure>
                    <img src="http://localhost:3002/images/2022-03-07T23-48-56.703Z.jpg"/>
                    <figcaption>
                        Lorem ipsum
                    </figcaption>
                </figure>
                <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                    Officiis aperiam ducimus similique dolore odio libero quasi, nihil facilis! 
                    Deleniti a iure cum repellendus nihil veritatis qui enim sunt earum dolorem.
                    Officiis aperiam ducimus similique dolore odio libero quasi, nihil facilis! 
                    Deleniti a iure cum repellendus nihil veritatis qui enim sunt earum dolorem.
                </p>
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
                    Cumque vero labore molestiae! Tenetur quasi, rerum deleniti accusamus beatae culpa? 
                    Quam architecto at, praesentium quos labore officia molestiae amet? 
                    Excepturi molestias ipsum veritatis modi minus nemo iure, 
                    ut ullam ex ad possimus provident eum quam nam dolorem atque 
                    cupiditate quia labore pariatur consequuntur! 
                    Saepe magni, ratione delectus nulla maxime impedit? Beatae.
                </p>
            </div>
        `,
        id_autora: 1,
        datumPisanja: "2022-1-22"
    }
];

seederObjave.forEach((objava) => {
    const upit: string = `INSERT INTO objave(naslov, URLNaslovneSlike, kratakOpis, sadrzaj, id_autora, datumPisanja) 
    VALUES (?, ?, ?, ?, ?, ?);`

    const nizParametara = [
        objava.naslov,
        objava.URLNaslovneSlike,
        objava.kratakOpis,
        objava.sadrzaj,
        objava.id_autora,
        objava.datumPisanja
    ];

    const konekcija = uspostaviKonekciju();
    konekcija.query(upit, nizParametara, (greska: any, rezultat: any) => {
        if(greska)
        {
            console.error(greska);
        }
        else
        {
            console.log(rezultat);
        }
    });
});