export {}

const mysql = require("mysql2");

const mysqlPool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "djole",
    connectionLimit: 5
});

const korisnici = [
{
    korisnickoIme: "joca",
    lozinka: "jocajoca",
    adminStatus: 1
},
{
    korisnickoIme: "nisamAdmin",
    lozinka: "1234",
    adminStatus: 0
}
];

const objave = [
    {
        URLNaslovneSlike: "https://exceptionnotfound.net/content/images/2020/04/one-codebase---multiple-versions.jpg",
        naslov: "Naslov1",
        kratakOpis: "Kratak opis",
        sadrzaj: `
            <div>
                <p>
                   Embedded chip documentation is sometimes <em>very</em> bad, and very confusing. 
                   Frequently it's difficult to really understand the ins and outs of a given chip 
                   without simply getting experience.
                </p>
                <p>Which is why <strong>Mr. Scrith</strong> was a bit surprised with this code, which came from someone who definitely should have known better.</p>
                <p>This code is for a "walking 1s" memory test- it simply visits every address in memory and writes a "1" and confirms that it can read back that "1". Such a test poses an interesting challenge: you can't use any variables, because they will live in RAM somewhere, so you need to limit yourself only to the registers exposed by your CPU.</p>
                <p>And that's where this developer made their odd choice. This particular CPU had plenty of general purpose registers, and a bunch of special purpose registers, like a set of registers for controlling <abbr title="Pulse Width Modulation">PWM</abbr> generators. The developer either couldn't find the correct way to access the general purpose registers or didn't care to try, but either way, the end result was that they used the PWM registers for <em>everything</em>:</p>
                <p>The code <em>works</em>, but it's certainly an odd choice. When Mr. Scrith suggested that <code>PWMDTY23</code> wasn't the clearest choice of register, the developer said, "Oh, should I <code>#define</code> a macro no name it more clearly?"</p>
            </div>
        `,
        datumPisanja: "2022-01-01"        
    },
    {
        URLNaslovneSlike: "https://images.unsplash.com/photo-1499244571948-7ccddb3583f1?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ",
        naslov: "Naslov2",
        kratakOpis: "Kratak opis",
        sadrzaj: "Mustafa",
        datumPisanja: "2022-01-01"        
    },
    {
        URLNaslovneSlike: "https://images.unsplash.com/photo-1508726096737-5ac7ca26345f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ",
        naslov: "Naslov3",
        kratakOpis: "Kratak opis",
        sadrzaj: "Mustafa",
        datumPisanja: "2022-01-01"        
    },
    {
        URLNaslovneSlike: "https://exceptionnotfound.net/content/images/2018/07/airplane-guidance.JPG",
        naslov: "Naslov4",
        kratakOpis: "Kratak opis",
        sadrzaj: "Mustafa",
        datumPisanja: "2022-01-01"        
    }
];

const tagovi = ["sport", "kuvanje", "kultura", "programiranje"];

const promiseKorisnici = new Promise((resolve, reject) => {
    let nizPromisa: Promise<any>[] = [];

    korisnici.forEach((korisnik) => {
        let upit = `
            INSERT INTO korisnici(korisnickoIme, lozinka, admin_status)
            VALUES("${korisnik.korisnickoIme}", "${korisnik.lozinka}", b'${korisnik.adminStatus}')`;
        
        nizPromisa.push(izvrsiUpit(upit, "korisnici"));
    });

    Promise.all(nizPromisa).then(() => {
        let nizPromisa: Promise<any>[] = [];
    
        objave.forEach((objava) => {
            let upit = `
                INSERT INTO objave(naslov, URLNaslovneSlike, kratakOpis, sadrzaj, id_autora, datumPisanja) 
                VALUES (?, ?, ?, ?, (SELECT id FROM korisnici ORDER BY RAND() LIMIT 1), '2022-01-01');
            `;
            
            const nizParametara = [
                objava.naslov,
                objava.URLNaslovneSlike,
                objava.kratakOpis,
                objava.sadrzaj,
            ];

            nizPromisa.push(upitSaParametrima(upit, nizParametara, "objave"));
        });
    
        // resolve(Promise.all(nizPromisa));
        return Promise.all(nizPromisa);
    })
    .then(() => {
        let nizPromisa: Promise<any>[] = [];

        tagovi.forEach((tag) => {
            let upit = `
                INSERT INTO tagovi(naziv)
                VALUES ("${tag}");
            `;

            nizPromisa.push(izvrsiUpit(upit, "tagovi"));
        });

        resolve(Promise.all(nizPromisa));
    });
});

promiseKorisnici.then(() => console.log("Azul y negro")).catch((greska) => {
    console.error(greska);
}).finally(() => {
    mysqlPool.end();
});

function izvrsiUpit(upit: string, nazivTabele: string)
{
    return new Promise((resolve, reject) => {
        mysqlPool.query(upit, (greska: any, rezultat: any) => {
            if(greska)
            {
                reject(greska);
            }
            else
            {
                console.log("Ubacena nova vrsta u tabeli: " + nazivTabele);
                resolve(rezultat);
            }
        });        
    });
}

function upitSaParametrima(upit: string, objekatParametri: any, nazivTabele: string)
{
    return new Promise((resolve, reject) => {
        mysqlPool.query(upit, objekatParametri, (greska: any, rezultat: any) => {
            if(greska)
            {
                reject(greska);
            }
            else
            {
                console.log("Ubacena nova vrsta u tabeli: " + nazivTabele);
                resolve(rezultat);
            }
        });
    });
}