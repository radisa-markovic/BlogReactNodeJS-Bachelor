import { useEffect, useState } from 'react';

import { 
  createBrowserRouter,  
  redirect, 
  RouteObject, 
  RouterProvider 
} from 'react-router-dom';

import LoginPage, { loginAction, loginLoader } from './pages/LoginPage';
import RegisterPage, { action as registerAction, registerLoader } from './pages/RegisterPage';
import NewPostPage from './pages/NewPost';
import EditPostPage, { loader as singlePostLoader } from './pages/EditPost';
import SinglePostPage from './pages/SinglePostPage';
import PostsPage, { loader as postsLoader } from './pages/Posts';
import ErrorPage from './pages/ErrorPage';

import { authProvider } from './api/auth';

import Layout from './Layout';
import { action as deleteOnePost } from './components/blog/PostPreviewCard';
import { action as postOperations } from './components/blog/PostForm';
import { action as addComment, dislikePost, likePost } from './components/blog/SinglePost';

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
    path: '/post/:id/like',
    action: likePost
  },
  {
    path: '/post/:id/dislike',
    action: dislikePost
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