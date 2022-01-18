import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  ExplorePage,
  HomePage,
  NotFoundPage,
  UserPage,
  UserMenuPage,
  CommentsPage,
  NotificationsPage,
  SignupPage,
  UserPostsPage,
  LoginPage,
  UploadPage,
  UserEditPage,
  PostPage,
} from '../pages';
import { PreventedRoute, PrivateRoute } from './utilRoutes';

const Router = () => {
  return (
    <Switch>
      <PrivateRoute path="/" exact component={HomePage} />
      <PrivateRoute path="/explore" exact component={ExplorePage} />
      <PreventedRoute path="/signup" exact component={SignupPage} />
      <PreventedRoute path="/login" exact component={LoginPage} />
      <PrivateRoute path="/comments/:postId" exact component={CommentsPage} />
      <PrivateRoute path="/notifications" exact component={NotificationsPage} />
      <PrivateRoute path="/upload" exact component={UploadPage} />
      <Route path="/user/:userName" exact component={UserPage} />
      <PrivateRoute path="/user/:userName/menu" exact component={UserMenuPage} />
      <PrivateRoute path="/user/:userName/edit" exact component={UserEditPage} />
      {/* /post/:postId?user=:userId&weather=20 */}
      <Route path="/user/:userName/post" exact component={UserPostsPage} />
      <Route path="/post/:postId" exact component={PostPage} />
      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
};

export default Router;
