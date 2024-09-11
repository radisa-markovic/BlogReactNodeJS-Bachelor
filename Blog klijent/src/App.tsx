import { useEffect, useState } from 'react';

import { 
  createBrowserRouter, 
  Outlet, 
  redirect, 
  RouteObject, 
  RouterProvider 
} from 'react-router-dom';

import LoginPage, { loginAction, loginLoader } from './components/korisnik/LoginPage';
import RegisterPage, { registerAction, registerLoader } from './components/korisnik/RegisterPage';
import ErrorPage from './ErrorPage';
import { authProvider } from './api/auth';

import Layout from './Layout';
import NewPostPage from './pages/NewPost';
import EditPostPage, { loader as singlePostLoader } from './pages/EditPost';
import SinglePostPage from './pages/SinglePostPage';
import PostsPage, { loader as postsLoader } from './pages/Posts';
import { action as deleteOnePost } from './components/blog/PostPreviewCard';
import { action as postOperations } from './components/blog/PostForm';
import { action as addComment } from './components/blog/SinglePost';

const routes: RouteObject[] = [
  {
    path: '/',
    Component: Layout,
    id: 'root',
    async loader() {
      return authProvider.userData;
    },
    errorElement: <ErrorPage/>,
    children: [
      {
        index: true,
        element: <h1>Home page</h1>
      },
      {
        path: 'login',
        action: loginAction,
        loader: loginLoader,
        element: <LoginPage/>
      },
      {
        path: 'register',
        action: registerAction,
        loader: registerLoader,
        element: <RegisterPage/>
      },
      {
        path: 'posts',
        loader: postsLoader,
        element: <PostsPage/>
      },
      {
        path: "post",
        children: [
          {
            path: "new",
            element: <NewPostPage/>,
            action: postOperations
          },
          {
            path: ":postId",
            id: 'single-post',
            loader: singlePostLoader,
            children: [
              {
                index: true,
                element: <SinglePostPage/>
              },
              {
                path: "edit",
                element: <EditPostPage/>,
                action: postOperations
              },
            ]
          }
        ]
      },
      {
        path: '*',
        element: <h1 style={{textAlign: 'center'}}>Page not found</h1>
      }      
    ]
  },
  {
    path: '/logout',
    async action() {
      // We signout in a "resource route" that we can hit from a fetcher.Form
      await authProvider.logout();
      return redirect("/");
    }
  },
  {
    path: '/post/:id/delete',
    action: deleteOnePost
  },
  {
    path: "/comment/:postId/add",
    action: addComment
  }
];

export default function App()
{
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);

  useEffect(() => {
    authProvider.checkAuthStatus().then((response) => {
      setIsAuthenticating(false);
    });
  }, []);

  if(isAuthenticating)
  {
      return (
        <h1 style={{textAlign: 'center'}}>
          Authenticating...
        </h1>
      );
  }

  const router = createBrowserRouter(routes);

  return (
      <RouterProvider 
          router={router} 
          fallbackElement={<p>Initial Load...</p>} 
      />
  );
}

// function App() {
  // return (
  //   <BrowserRouter>
  //     <Navbar 
  //         accessToken={accessToken}
  //         userData={userData} 
  //         logout={logout}
  //         // brojNeprocitanihObjava={korisnik.brojNeprocitanihPoruka}
  //         // adminJePrijavljen={korisnik.adminStatus}
  //     />
  //     <Switch>
  //       <Route exact path="/">
  //         <Home/>
  //       </Route>
  //       <Route exact path="/napraviNalog">
  //         <NapraviNalog/>
  //       </Route>
  //       <Route exact path="/prijaviSe">
  //         <PrijaviSe 
  //             setAccessToken={setAccessToken}
  //             setUserData={setUserData}
  //         />
  //       </Route>
  //       {/* <PrivateRoute 
  //           exact 
  //           path="/napisiObjavu" 
  //           accessToken={accessToken}
  //       > */}
  //       <Route exact path="/napisiObjavu">
  //         <NapisiObjavu 
  //             accessToken={accessToken}
  //             userData={userData}
  //         />
  //       </Route>
  //       {/* </PrivateRoute> */}
  //       {/*========== ZA EDIT ==========*/}
  //       {/* <Route exact path="/napisiObjavu/:idObjave">
  //         <NapisiObjavu prijavljeniKorisnik={korisnik}/>
  //       </Route> */}
  //       <Route exact path="/sveObjave">
  //         <PostList 
  //             adminJePrijavljen={korisnik.adminStatus} 
  //             prijavljenoKorisnickoIme={korisnik.korisnickoIme}
  //         />
  //       </Route>
  //       {/*ovo treba da se sredi u smislu naziva komponente i tome slicno*/}
  //       {/* <Route exact path="/objava/:id">
  //         <PunaObjava prijavljeniKorisnik={korisnik}/>
  //       </Route> */}
  //       <PrivateRoute accessToken={accessToken}>
  //         <Route exact path="/post/:id">
  //           <NapisiObjavu 
  //               accessToken={accessToken}
  //               userData={userData}
  //           />
  //         </Route>
  //       </PrivateRoute>
  //       <Route exact path="/objaveKorisnika/:korisnickoIme">
  //         <KorisnickaStanica 
  //             adminJePrijavljen={korisnik.adminStatus} 
  //             korisnik={korisnik}
  //         />
  //       </Route>
  //       <Route exact path="/mojaAktivnost">
  //         <Aktivnost korisnik={korisnik}/>
  //       </Route>
  //       <Route exact path="/poruke/:korisnickoIme">
  //         <SpisakPoruka korisnickoIme={korisnik.korisnickoIme}/>
  //       </Route>
  //       <Route exact path="/napisiPoruku">
  //         <NapisiPoruku korisnickoIme={korisnik.korisnickoIme}/>
  //       </Route>
  //       <Route exact path="/admin">
  //         <AdminPanel prijavljenoKorisnickoIme={korisnik.korisnickoIme}/>
  //       </Route>
  //       <Route exact path="/obavestenjeOZabrani/:korisnickoIme/:razlog">
  //         <BanovaniKorisnikPrikaz/>
  //       </Route>
  //       <Route exact path="/pretplatiSe">
  //         <PretplataNaBlog/>
  //       </Route>
  //     </Switch>
  //   </BrowserRouter>
  // );
// }