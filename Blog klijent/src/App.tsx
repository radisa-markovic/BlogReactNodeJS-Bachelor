import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NapisiObjavu from './components/blog/NapisiObjavu';
import SpisakObjava from './components/blog/SpisakObjava';
import Home from './components/Home';
import NapraviNalog from './components/korisnik/NapraviNalog';
import Navbar from './components/Navbar';
import PrijaviSe from './components/korisnik/PrijaviSe';
import AdminPanel from './components/korisnik/AdminPanel';
import PunaObjava from './components/blog/PunaObjava';
import { useEffect, useState } from 'react';
import { Korisnik } from './models/Korisnik';
import Aktivnost from './components/korisnik/Aktivnost';
import SpisakPoruka from './components/poruke/SpisakPoruka';
import NapisiPoruku from './components/poruke/NapisiPoruku';
import { BanovaniKorisnikPrikaz } from './components/korisnik/BanovaniKorisnikPrikaz';
import KorisnickaStanica from './components/korisnik/KorisnickaStranica';
import { PretplataNaBlog } from './components/PretplataNaBlog';



function App() {
  const [korisnik, setKorisnik] = useState<Korisnik>({
    id: -1, 
    korisnickoIme: "",
    adminStatus: false,
    brojNeprocitanihPoruka: 0
  });

  useEffect(() => {
    const prijavljeniKorisnik = localStorage.getItem("korisnik");
    if(prijavljeniKorisnik)
    {
      const prijavljeniKorisnikJSON = JSON.parse(prijavljeniKorisnik);
      setKorisnik(prijavljeniKorisnikJSON);
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar korisnickoIme={korisnik.korisnickoIme} 
              setKorisnik={setKorisnik}
              brojNeprocitanihObjava={korisnik.brojNeprocitanihPoruka}
              adminJePrijavljen={korisnik.adminStatus}
      />
      <Switch>
        <Route exact path="/">
          <Home/>
        </Route>
        <Route exact path="/napraviNalog">
          <NapraviNalog/>
        </Route>
        <Route exact path="/prijaviSe">
          <PrijaviSe korisnickoIme={korisnik.korisnickoIme} setKorisnik={setKorisnik}/>
        </Route>
        <Route exact path="/napisiObjavu">
          <NapisiObjavu prijavljeniKorisnik={korisnik}/>
        </Route>
        {/*========== ZA EDIT ==========*/}
        <Route exact path="/napisiObjavu/:idObjave">
          <NapisiObjavu prijavljeniKorisnik={korisnik}/>
        </Route>
        <Route exact path="/sveObjave">
          <SpisakObjava adminJePrijavljen={korisnik.adminStatus} 
                        prijavljenoKorisnickoIme={korisnik.korisnickoIme}
          />
        </Route>
        {/*ovo treba da se sredi u smislu naziva komponente i tome slicno*/}
        <Route exact path="/objava/:id">
          <PunaObjava prijavljeniKorisnik={korisnik}/>
        </Route>
        <Route exact path="/objaveKorisnika/:korisnickoIme">
          <KorisnickaStanica adminJePrijavljen={korisnik.adminStatus} korisnik={korisnik}/>
        </Route>
        <Route exact path="/mojaAktivnost">
          <Aktivnost korisnik={korisnik}/>
        </Route>
        <Route exact path="/poruke/:korisnickoIme">
          <SpisakPoruka korisnickoIme={korisnik.korisnickoIme}/>
        </Route>
        <Route exact path="/napisiPoruku">
          <NapisiPoruku korisnickoIme={korisnik.korisnickoIme}/>
        </Route>
        <Route exact path="/admin">
          <AdminPanel prijavljenoKorisnickoIme={korisnik.korisnickoIme}/>
        </Route>
        <Route exact path="/obavestenjeOZabrani/:korisnickoIme/:razlog">
          <BanovaniKorisnikPrikaz/>
        </Route>
        <Route exact path="/pretplatiSe">
          <PretplataNaBlog/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
