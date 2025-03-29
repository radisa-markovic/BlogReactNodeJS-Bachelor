import { 
    NavLink, 
    useFetcher, 
} from 'react-router-dom';

import styles from './Navbar.module.css';
import { RouteNames } from '../routes';
import { authProvider } from '../api/auth';

export default function Navbar()
{    
    const fetcher = useFetcher();
    let isLoggingOut = fetcher.formData != null;

    return (
        <nav className={styles['navigation-bar']}>
            <ul className={styles.items + " container"}>
                <li className="navigation__item">
                    <NavLink 
                        to="/"
                        style={{display: 'block', width: '140px', marginRight: 'auto'}}
                    >
                        <img src="/Logo.png" alt="React blog logo" />
                    </NavLink>
                </li>
                <li className={styles['navigation__item']}>
                    <NavLink
                        to="/"
                        className={({ isActive, isPending }) =>
                            isActive
                              ? styles["active-route"]
                              : isPending
                              ? "pending"
                              : ""
                          }
                    >
                        Naslovna
                    </NavLink>
                </li>
                <li className={styles['navigation__item']}>
                    <NavLink
                        to={RouteNames.allPosts}
                        className={({ isActive, isPending }) =>
                            isActive
                              ? styles["active-route"]
                              : isPending
                              ? "pending"
                              : ""
                          }
                    >
                        Sve objave
                    </NavLink>
                </li>
                {
                    !authProvider.accessToken ?
                    <>
                        <li className={styles['navigation__item']}>
                            <NavLink
                                to={RouteNames.loginPage}
                                className={({ isActive, isPending }) =>
                                    isActive
                                    ? styles["active-route"]
                                    : isPending
                                    ? "pending"
                                    : ""
                                }
                            >
                                Prijavi se
                            </NavLink>
                        </li>
                        <li className={styles['navigation__item']}>
                            <NavLink
                                to={RouteNames.registerPage}
                                className={({ isActive, isPending }) =>
                                    isActive
                                    ? styles["active-route"]
                                    : isPending
                                    ? "pending"
                                    : ""
                                }
                            >
                                Napravi nalog
                            </NavLink>
                        </li>
                    </>
                    :
                    <>
                        <li className={styles['navigation__item']}>
                            <NavLink
                                to="post/new"
                                className={({ isActive, isPending }) =>
                                    isActive
                                    ? styles["active-route"]
                                    : isPending
                                    ? "pending"
                                    : ""
                                }
                            >
                                Napiši objavu
                            </NavLink>
                        </li>
                        <li className={styles['navigation__item']}>
                            <fetcher.Form
                                method='post'
                                action='/logout'
                            >
                                <button type='submit'>
                                    { isLoggingOut? "Logging out" : "Log out"}
                                </button>
                            </fetcher.Form>
                        </li>
                    </>
                }   
            </ul>
        </nav>
    );
}