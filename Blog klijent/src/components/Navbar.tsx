import React from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { Korisnik } from '../models/Korisnik';

interface NavbarProps
{
    korisnickoIme: string,
    adminJePrijavljen: boolean,
    brojNeprocitanihObjava: number,
    setKorisnik: React.Dispatch<React.SetStateAction<Korisnik>>;
}

function Navbar(props: NavbarProps): JSX.Element
{
    const { korisnickoIme, adminJePrijavljen, setKorisnik: setKorisnickoIme } = props;
    const history = useHistory();
    console.log(props.brojNeprocitanihObjava)

    return (
        <nav className="navigation">
            <input type="checkbox" 
                   name="navigacijaHamburger" 
                   id="navigacijaHamburger" 
            />
            <label htmlFor="navigacijaHamburger"
                   className='navigacija__hamburger'
            >
                Menu
            </label>
            <ul className="navigation__items container">
                <li className="navigation__item">
                    <Link to="/" className="navigation__link" style={{fontFamily: 'fantasy'}}>
                        BLOG
                    </Link>
                </li>
                <li className="navigation__item">
                    <NavLink 
                        exact
                        to="/" 
                        className="navigation__link"
                        activeClassName='active-route'    
                    >
                        Početna
                    </NavLink>
                </li>
                <li className="navigation__item">
                    <NavLink 
                        to="/sveObjave" 
                        className="navigation__link"
                        activeClassName='active-route'    
                    >
                        Sve objave
                    </NavLink>
                </li>
                <li className="navigation__item">
                    <NavLink 
                        to="/pretplatiSe" 
                        className="navigation__link"
                        activeClassName='active-route'    
                    >
                        Pretplata
                    </NavLink>
                </li>
                { korisnickoIme === "" && prikazZaNeprijavljene() }
                
                { korisnickoIme !== "" && nacrtajKorisnickiMeni() }
            </ul>
        </nav>
    );

    function prikazZaNeprijavljene(): JSX.Element
    {
        return (
            <>
                <li className="navigation__item">
                    <NavLink 
                        to="/napraviNalog" 
                        className="navigation__link"
                        activeClassName='active-route'
                    >
                        Pravljenje naloga
                    </NavLink>
                </li>
                <li className="navigation__item">
                    <NavLink 
                        to="/prijaviSe" 
                        className="navigation__link"
                        activeClassName='active-route'    
                    >
                        Prijava
                    </NavLink>
                </li>
            </>
        );
    }

    function nacrtajKorisnickiMeni(): JSX.Element
    {
        return (
            <li className="navigation__item dropdown__parent" onTouchEnd={(event) => toggleMenu(event)}>
                <Link to={`/poruke/${props.korisnickoIme}`} 
                      className='dugme-broj-neprocitanih-poruka'
                >
                    { props.brojNeprocitanihObjava }
                </Link>
                <span>({ korisnickoIme })</span> 
                <ul className="dropdown__kid korisnicki-dropdown">
                    <li className="navigation__item">
                        <NavLink 
                            exact
                            to="/napisiObjavu" 
                            className="navigation__link"
                            activeClassName='active-route'    
                        >
                            Napiši objavu
                        </NavLink>
                    </li>
                    <li className="navigation__item">
                        <NavLink 
                            to={`/objaveKorisnika/${korisnickoIme}`} 
                            className="navigation__link"
                            activeClassName='active-route'
                        >
                            Korisnička stranica
                        </NavLink>
                    </li>
                    <li className='navigation__item'>
                        <NavLink 
                            to="/mojaAktivnost" 
                            className="navigation__link"
                            activeClassName='active-route'
                        >
                            Moja aktivnost
                        </NavLink>
                    </li>
                    <li className="navigation__item">
                        <NavLink 
                            to="/napisiPoruku" 
                            className="navigation__link"
                            activeClassName='active-route'    
                        >
                            Napiši poruku
                        </NavLink>
                    </li>
                    <li className="navigation__item">
                        <NavLink 
                            to={`/poruke/${korisnickoIme}`} 
                            className="navigation__link"
                            activeClassName='active-route'    
                        >
                            Poruke
                        </NavLink>
                    </li>
                    {
                        adminJePrijavljen && (
                            <li className="navigation__item">
                                <NavLink 
                                    to="/admin" 
                                    className="navigation__link"
                                    activeClassName='active-route'    
                                >
                                    Admin
                                </NavLink>
                            </li> 
                        )
                    }
                    <li className="navigation__item">
                        <Link to="#" className="navigation__link" onClick={odjaviSe}>
                            Odjava
                        </Link>
                    </li>
                </ul>
            </li>
        );
    }

    function odjaviSe()
    {
        setKorisnickoIme({
            id: -1, 
            korisnickoIme: "",
            adminStatus: false,
            brojNeprocitanihPoruka: -1
        });    
        localStorage.removeItem("korisnik");
        history.push("/");  
        alert("Uspešna odjava");          
    }

    function toggleMenu(event: React.TouchEvent<HTMLLIElement>)
    {
        const { target } = event;
        //@ts-ignore
        target.classList.toggle("navigation-active");
    }
}

export default Navbar;