export const OSNOVNI_PUT = "http://localhost:3002";
// export const OSNOVNI_PUT = "https://diplomskiblog.nutri4run.com";
/*=== neke od ovih objava zahtevaju i dodatni atribut za id, pogledati rute na serveru ===*/

export const KORISNICI_API: string = `${OSNOVNI_PUT}/prijaviSe`;
export const OBJAVE_API = `${OSNOVNI_PUT}/sveObjave`;
/*=== parametar /:idObjave ===*/
export const AZURIRAJ_OBJAVU = `${OSNOVNI_PUT}/azurirajObjavu`;
export const JEDNA_OBJAVA = `${OSNOVNI_PUT}/objava`;
export const OBRISI_OBJAVU = `${OSNOVNI_PUT}/obrisiObjavu`;
export const SVI_TAGOVI = `${OSNOVNI_PUT}/vratiTagove`;
export const DODAJ_NOVI_TAG = `${OSNOVNI_PUT}/tag/dodajNoviTag`;
export const VRATI_OBJAVE_POD_TAGOVIMA = `${OSNOVNI_PUT}/objavePodTagom`;
export const VRARTI_PREPORUCENE_CLANKE = `${OSNOVNI_PUT}/vratiPreporuceneObjave`;
export const NAPRAVI_OBJAVU = `${OSNOVNI_PUT}/napraviObjavu`;
/*parametar :korisnickoIme*/
export const VRATI_LAJKOVANE_OBJAVE = `${OSNOVNI_PUT}/lajkovaneObjave`;
/*parametar :korisnickoIme*/
export const VRATI_DISLAJKOVANE_OBJAVE = `${OSNOVNI_PUT}/dislajkovaneObjave`;
/*parametar :korisnickoIme*/
export const VRATI_MOJE_OBJAVE = `${OSNOVNI_PUT}/korisnikoveObjave`;

export const VRATI_REAKCIJE_NA_OBJAVU = `${OSNOVNI_PUT}/vratiReakcijuNaObjavu`;
export const LAJKUJ_OBJAVU = `${OSNOVNI_PUT}/lajkujObjavu`;
export const DISLAJKUJ_OBJAVU = `${OSNOVNI_PUT}/dislajkujObjavu`;
/*paramettar rute: idObjave */
export const REAGUJ_NA_OBJAVU = `${OSNOVNI_PUT}/reagujNaObjavu`;

/*parametar: ":korisnickoIme" ide posle "sviKomentari" */
export const VRATI_SVE_KORISNIKOVE_KOMENTARE = `${OSNOVNI_PUT}/sviKomentari`;

/*========= PORUKE ============*/
export const UPISI_PORUKU = `${OSNOVNI_PUT}/napisiPoruku`;
/*-- korisnickoIme, i tipPoruka su parametri rute*/
export const VRATI_KORISNIKOVE_PORUKE = `${OSNOVNI_PUT}/vratiPoruke`;
/**-- idPoruke parametar rute */
export const OZNACI_PORUKU_PROCITANOM = `${OSNOVNI_PUT}/oznaciPorukuProcitanom`;

/*========>>> pretrage */
export const PRETRAZI_KORISNICKO_IME = `${OSNOVNI_PUT}/pretraziKorisnika`;
export const PRETRAZI_NASLOV_OBJAVE = `${OSNOVNI_PUT}/pretraziObjavu`;

/*=======>> vracanje */
export const VRATI_SVE_KORISNIKE = `${OSNOVNI_PUT}/vratiSveKorisnike`;
export const VRATI_BANOVANE_KORISNIKE = `${OSNOVNI_PUT}/vratiBanovaneKorisnike`;
/*parametar rute je :korisnickoIme*/
export const PROVERI_BANOVANJE_ZA_KORISNIKA = `${OSNOVNI_PUT}/proveriBanovanjeZaKorisnika`;

/*====>> admin kontrole */
export const BANUJ_KORISNIKA = `${OSNOVNI_PUT}/banujKorisnika`;
export const ODBLOKIRAJ_KORISNIKA = `${OSNOVNI_PUT}/odblokirajKorisnika`;
/*parametar rute /:idKomentara*/
export const OBRISI_KOMENTAR = `${OSNOVNI_PUT}/obrisiKomentar`;

export const UCITAJ_TAGOVE_ZA_PRETRAGU = `${OSNOVNI_PUT}/ucitajTagoveZaPretragu`;

/*======= SLIKE SA KORISNICKE STRANICE =======*/
//ima parametar rute: idKorisnika
// export const SLIKE_SA_KORISNICKE_STRANICE = `${OSNOVNI_PUT}/korisnickeSlike`;
export const URL_NASLOVNA_SLIKA = `${OSNOVNI_PUT}/postaviNaslovnu`;
export const URL_PROFILNA_SLIKA = `${OSNOVNI_PUT}/postaviProfilnu`;

export const URL_ZA_KORISNICKE_SLIKE = `${OSNOVNI_PUT}/korisnickeSlike`;

/*======== PRETPLATE MEJLOVI ========*/
export const POTVRDI_MEJL_ZA_PRETPLATU = `${OSNOVNI_PUT}/potvrdiMejlZaPretplatu`;


/*=========== KONSTANTE ZA BAZU =============*/
export const PLACEHOLDER_PROFILE_IMAGE: string = "http://localhost:3002/images/ProfileImagePlaceholder.jpg";
export const PLACEHOLDER_COVER_IMAGE: string = "http://localhost:3002/images/CoverImagePlaceholder.png";