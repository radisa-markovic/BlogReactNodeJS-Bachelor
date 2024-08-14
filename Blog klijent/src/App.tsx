import { BrowserRouter, Route, Switch } from 'react-router-dom';

import NapisiObjavu from './components/blog/NapisiObjavu';
import SpisakObjava from './components/blog/PostList';
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
import PostList from './components/blog/PostList';
import { BASE_URL } from './api/api';

function App() {
  const [korisnik, setKorisnik] = useState<Korisnik>({
    id: -1, 
    korisnickoIme: "",
    adminStatus: false,
    brojNeprocitanihPoruka: 0
  });
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string>("");
  const [userData, setUserData] = useState<{id: number, username: string}>({
    id: -1,
    username: ''
  });

  useEffect(() => {
      const checkAuth = async () => {
        try
        {
            const response = await fetch(BASE_URL + "/users/auth", {
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              mode: 'cors',
              method: "POST"
            });
            if(response.ok)
            {
                const jsonResponse = await response.json();
                setAccessToken(jsonResponse.accessToken);
                setUserData(jsonResponse.userData);
            }
            setIsAuthenticating(false);
        }
        catch(error)
        {
          console.error(error);
        }
      }

      checkAuth();
  }, []);

  const logout = async () => {
    const response = await fetch(BASE_URL + "/users/logout", {
      headers: {
        'Authorization': "Bearer " + accessToken
      },
      mode: 'cors',
      credentials: 'include',
      method: "POST",
      body: JSON.stringify(userData)
    });

    if(response.ok)
    {
        alert("User is logged out");
        setAccessToken('');
        setUserData({
          id: -1,
          username: ''
        });
    }
    
  }

  if(isAuthenticating)
    return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Navbar 
          accessToken={accessToken}
          userData={userData} 
          logout={logout}
          // brojNeprocitanihObjava={korisnik.brojNeprocitanihPoruka}
          // adminJePrijavljen={korisnik.adminStatus}
      />
      <Switch>
        <Route exact path="/">
          <Home/>
        </Route>
        <Route exact path="/napraviNalog">
          <NapraviNalog/>
        </Route>
        <Route exact path="/prijaviSe">
          <PrijaviSe 
              setAccessToken={setAccessToken}
              setUserData={setUserData}
          />
        </Route>
        <Route exact path="/napisiObjavu">
          <NapisiObjavu 
              accessToken={accessToken}
              userData={userData}
          />
        </Route>
        {/*========== ZA EDIT ==========*/}
        {/* <Route exact path="/napisiObjavu/:idObjave">
          <NapisiObjavu prijavljeniKorisnik={korisnik}/>
        </Route> */}
        <Route exact path="/sveObjave">
          <PostList 
              adminJePrijavljen={korisnik.adminStatus} 
              prijavljenoKorisnickoIme={korisnik.korisnickoIme}
          />
        </Route>
        {/*ovo treba da se sredi u smislu naziva komponente i tome slicno*/}
        {/* <Route exact path="/objava/:id">
          <PunaObjava prijavljeniKorisnik={korisnik}/>
        </Route> */}
        <Route exact path="/post/:id">
          <NapisiObjavu 
              accessToken={accessToken}
              userData={userData}
          />
        </Route>
        <Route exact path="/objaveKorisnika/:korisnickoIme">
          <KorisnickaStanica 
              adminJePrijavljen={korisnik.adminStatus} 
              korisnik={korisnik}
          />
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
