const mysql = require("mysql2");

const mysqlPool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    // database: "djole",
    connectionLimit: 5
});

const nazivBaze: string = "djole";

let upit = `CREATE DATABASE IF NOT EXISTS ${nazivBaze}`;
izvrsiUpit(upit, "")
.then(() => {
	upit = `USE ${nazivBaze};`
	return izvrsiUpit(upit, "");
})
.then(() => {
	upit = `CREATE TABLE IF NOT EXISTS korisnici (
		id INT PRIMARY KEY AUTO_INCREMENT,
		korisnickoIme VARCHAR(255) NOT NULL UNIQUE,
		lozinka VARCHAR(255) NOT NULL,
		admin_status BIT(1) DEFAULT b'0'   
	);`;
	return izvrsiUpit(upit, "korisnici")
})
.then(() => {
	upit = `CREATE TABLE IF NOT EXISTS objave (
		id INT PRIMARY KEY AUTO_INCREMENT,
		naslov VARCHAR(255) NOT NULL,
		sadrzaj TEXT NOT NULL,
		id_autora INT,
		datumPisanja DATE,
		kratakOpis TEXT,
		URLNaslovneSlike TEXT,
		FOREIGN KEY(id_autora) REFERENCES korisnici(id)
		ON DELETE CASCADE
		);
	`;
	return izvrsiUpit(upit, "objave");
})
.then(() => {
	upit = `CREATE TABLE IF NOT EXISTS tagovi(
		id int PRIMARY KEY AUTO_INCREMENT,
		naziv VARCHAR(255) UNIQUE
	);`;
	return izvrsiUpit(upit, "tagovi");
})
.then(() => {
	upit = `CREATE TABLE IF NOT EXISTS tagovi_na_objavama(
		idTaga int,
		idObjave int,
		PRIMARY KEY(idTaga, idObjave),
		FOREIGN KEY(idTaga) REFERENCES tagovi(id),
		FOREIGN KEY(idObjave) REFERENCES objave(id)
	);`;
	return izvrsiUpit(upit, "tagovi_na_objavama");
})
.then(() => {
	upit = `
	CREATE TABLE IF NOT EXISTS komentari(
		id int PRIMARY KEY AUTO_INCREMENT,
		idAutora int,
		idObjave int,
		sadrzaj TEXT NOT NULL,	
		FOREIGN KEY(idAutora) REFERENCES korisnici(id),
		FOREIGN KEY(idObjave) REFERENCES objave(id)
	);
	`;
	return izvrsiUpit(upit, "komentari");
})
.then(() => {
	upit = `CREATE TABLE IF NOT EXISTS reakcije_na_objavama(
		idKorisnika INT,
		idObjave INT,
		lajk BIT(1),
	    PRIMARY KEY(idKorisnika, idObjave),
	    FOREIGN KEY(idKorisnika) REFERENCES korisnici(id),
		FOREIGN KEY(idObjave) REFERENCES objave(id)
	);`;
	return izvrsiUpit(upit, "reakcije_na_objavama");
})
.then(() => {
	upit = `CREATE TABLE IF NOT EXISTS lajkovi_na_komentarima(
		idKorisnika INT,
		idKomentara INT,
		lajk BIT(1),
		FOREIGN KEY(idKorisnika) REFERENCES korisnici(id),
		FOREIGN KEY(idKomentara) REFERENCES komentari(id)
	);`;
	return izvrsiUpit(upit, "lajkovi_na_komentarima");	
})
.then(() => {
	upit = `
	CREATE TABLE IF NOT EXISTS poruke(
			id INT AUTO_INCREMENT,
			imePosiljaoca VARCHAR(50),
			imePrimaoca VARCHAR(50),
			naslov VARCHAR(30) NOT NULL,
			sadrzaj TEXT NOT NULL,
			datumSlanja DATE NOT NULL,
			procitana BIT(1),
			PRIMARY KEY(id),
			FOREIGN KEY(imePosiljaoca) REFERENCES korisnici(korisnickoIme),
			FOREIGN KEY(imePrimaoca) REFERENCES korisnici(korisnickoIme)
		);
	`;
	return izvrsiUpit(upit, "poruke");
})
.then(() => {
	upit = `
	CREATE TABLE IF NOT EXISTS banovaniKorisnici(
			id INT AUTO_INCREMENT, /*surogat kljuc*/
			idKorisnika INT,
			razlog TEXT NOT NULL,
			PRIMARY KEY(id),
			FOREIGN KEY(idKorisnika) REFERENCES korisnici(id)
		);
	`;
	return izvrsiUpit(upit, "banovaniKorisnici");
})
.then(() => {
	upit = `
	CREATE TABLE IF NOT EXISTS slike_po_objavama(
			id int PRIMARY KEY AUTO_INCREMENT,
			idObjave int,
			urlSlike TEXT,
			
			CONSTRAINT fk_idObjave
			FOREIGN KEY (idObjave)
			REFERENCES objave (id)
			ON DELETE CASCADE
		);
	`;
	return izvrsiUpit(upit, "slike_po_objavama");
})
.then(() => {
	upit = `
	CREATE TABLE IF NOT EXISTS profilne_slike(
			id int PRIMARY KEY AUTO_INCREMENT,
			idKorisnika int,
			urlProfilneSlike TEXT,
			
			CONSTRAINT fk_idKorisnikaProfilneSlike
			FOREIGN KEY (idKorisnika)
			REFERENCES korisnici (id)
			ON DELETE CASCADE
		);
	`;
	return izvrsiUpit(upit, "profilne_slike");
})
.then(() => {
	upit = `
		CREATE TABLE IF NOT EXISTS naslovne_slike(
		id int PRIMARY KEY AUTO_INCREMENT,
		idKorisnika int,
		urlNaslovneSlike TEXT,
		
		CONSTRAINT fk_idKorisnikaNaslovneSlike
		FOREIGN KEY (idKorisnika)
		REFERENCES korisnici (id)
		ON DELETE CASCADE
	);
	`;

	return izvrsiUpit(upit, "naslovne_slike")
})
.then(() => {
	upit = `
	CREATE TABLE IF NOT EXISTS skladisteZaSlike(
		id int PRIMARY KEY AUTO_INCREMENT,
		urlSlike TEXT NOT NULL
	);
	`;
	return izvrsiUpit(upit, "skladisteZaSlike");
})
.then(() => {
	upit = `
	CREATE TABLE IF NOT EXISTS mejloviPretplatnika(
		id int PRIMARY KEY AUTO_INCREMENT,
		email VARCHAR(255) NOT NULL UNIQUE
	);
	`;
	return izvrsiUpit(upit, "mejloviPretplatnika");
})
.then(() => {
	mysqlPool.end();
})
.catch((greska) => {
	console.error(greska);
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
				console.log("Kreirana tabela: " + nazivTabele);
				resolve(rezultat);
			}
		});
	});
}