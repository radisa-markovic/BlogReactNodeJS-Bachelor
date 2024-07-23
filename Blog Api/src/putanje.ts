import { Express } from "express";

import { 
    dodajKomentarObjavi, 
    obrisiKomentar, 
    vratiKomentareNaObjavi, 
    vratiSveKorisnikoveKomentare 
} from "./komentari/komentar.kontroler";

import { 
    banujKorisnika,
    hendlujPravljenjeNaloga, 
    hendlujPrijavu, 
    odblokirajKorisnika, 
    pretraziKorisnika,
    proveriBanovanjeZaKorisnika,
    vratiBanovaneKorisnike,
    vratiKorisnickeSlike,
    vratiSveKorisnike
} from "./korisnik/korisnik.kontroler";

import { 
    azurirajObjavu,
    napraviObjavu, 
    obrisiObjavu, 
    pretraziObjavu, 
    reagujNaObjavu, 
    vratiDislajkovaneObjave, 
    vratiJednuObjavu, 
    vratiKorisnikoveObjave, 
    vratiLajkovaneObjave, 
    vratiPreporuceneObjave, 
    vratiReakcijuNaObjavu, 
    vratiSlikeSaObjave, 
    vratiSveObjave, 
    vratiSveObjavePodTagom 
} from "./objava/objava.kontroler";

import { dodajBrojLajkovaIDislajkova } from "./objava/objava.servis";

import { napisiPoruku, oznaciPorukuProcitanom, vratiKorisnikovePoruke } from "./poruke/poruka.kontroler";

import { 
    dodajTag, 
    ucitajTagoveZaPretragu, 
    vratiObjaveSaTagom, 
    vratiSveTagove,
} from "./tagovi/tag.kontroler";

import {
    azurirajTagove,
    dodajTagoveObjavama,
    vratiObjaveSaTagovima
} from "./tagovi/tag.servis";

import {
    dodajBrojKomentara
} from "./komentari/komentar.servis";

import { posaljiObavestenjePretplatnicima } from './mejlovi/mejl.servis'

export default function putanje(app: Express)
{
    /*========= KORISNICI ==========*/
    app.post("/prijaviSe", hendlujPrijavu);
    app.post("/napraviNalog", hendlujPravljenjeNaloga);
    app.get("/vratiSveKorisnike", vratiSveKorisnike);
    app.get("/vratiBanovaneKorisnike", vratiBanovaneKorisnike);
    app.post("/banujKorisnika", banujKorisnika);
    app.post("/odblokirajKorisnika", odblokirajKorisnika);
    app.get("/proveriBanovanjeZaKorisnika/:korisnickoIme", proveriBanovanjeZaKorisnika);
    app.get("/slikeSaObjave/:idObjave", vratiSlikeSaObjave);
    
    /*========= OBJAVE ==========*/
    app.post("/napraviObjavu", napraviObjavu, posaljiObavestenjePretplatnicima);
    /*== promenljiva unutar URL: odabraniTagovi[] ==*/
    app.get("/sveObjave/:brojElemenataPoStranici/:pomeraj/:korisnickoIme/:najnovijePrvo", vratiObjaveSaTagovima, vratiSveObjave, dodajTagoveObjavama, dodajBrojKomentara, dodajBrojLajkovaIDislajkova);
    app.get("/objava/:id", vratiJednuObjavu);
    app.get("/vratiKorisnikoveObjave/:idKorisnika", vratiKorisnikoveObjave);
    app.get("/objavePodTagom/:nazivTaga", vratiSveObjavePodTagom);
    app.get("/vratiPreporuceneObjave/:tipPreporuke", vratiPreporuceneObjave);
    app.post("/vratiReakcijuNaObjavu/:idObjave", vratiReakcijuNaObjavu);
    app.post("/reagujNaObjavu/:idObjave", reagujNaObjavu);
    // app.post("/lajkujObjavu/:idObjave", lajkujObjavu);
    // app.post("/dislajkujObjavu/:idObjave", dislajkujObjavu);
    app.patch("/azurirajObjavu/:idObjave", azurirajObjavu, azurirajTagove);
    app.get("/lajkovaneObjave/:korisnickoIme", vratiLajkovaneObjave);
    app.get("/dislajkovaneObjave/:korisnickoIme", vratiDislajkovaneObjave);
    app.get("/korisnikoveObjave/:korisnickoIme", vratiKorisnikoveObjave);
    app.delete("/obrisiObjavu/:idObjave", obrisiObjavu);
    app.delete("/obrisiKomentar/:idKomentara", obrisiKomentar);

    app.get("/vratiTagove", vratiSveTagove);
    app.get("/tag/:nazivTaga", vratiObjaveSaTagom);
    app.post("/tag/dodajNoviTag", dodajTag);

    app.get("/vratiKomentare/:idObjave", vratiKomentareNaObjavi);
    app.post("/dodajKomentar", dodajKomentarObjavi);
    app.get("/sviKomentari/:korisnickoIme", vratiSveKorisnikoveKomentare);

    /*=========== PORUKE (treba dodati polje za datum pisanja) ===========*/
    app.post("/napisiPoruku", napisiPoruku);
    app.get("/vratiPoruke/:korisnickoIme/:tipPoruke", vratiKorisnikovePoruke);
    app.patch("/oznaciPorukuProcitanom/:idPoruke", oznaciPorukuProcitanom);

    /*=========== PRETRAGA ===========*/
    app.post("/pretraziKorisnika", pretraziKorisnika);
    app.post("/pretraziObjavu", pretraziObjavu);

    /*=========== PRETRAGA ===========*/
    app.get("/ucitajTagoveZaPretragu", ucitajTagoveZaPretragu);

    /*====== KORISNICKE SLIKE ======*/
   
    //cu izmestim u app.ts, prvo mora da multer uradi posao da dobijem URL, posle sve ostalo
    // app.patch("/korisnickeSlike/:korisnickoIme", azurirajNaslovnuSliku);
}