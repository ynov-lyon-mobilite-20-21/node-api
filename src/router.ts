import { Router } from 'express';
import {
  deleteUser,
  getMe,
  getUserById,
  getUsers,
  postUser,
  updateUser,
  userActivation,
} from './controllers/UserController';
import { userMiddlewares } from './services/UserService';
import { logout, refreshUserToken, userAuthentication } from './controllers/AuthController';
import {
  deleteImageById, getAllImages, getOneImageById, postImage,
} from './controllers/ImageController';

import {
  getUserCards, linkUserCard, pay, removeCard, setDefaultCard,
} from './controllers/StripeController';
import {
  createTicket, deleteTicketById, getTicketById, getTickets, updateTicketById,
} from './controllers/TicketController';

const appRouter: Router = Router();

/*   USERS   */
appRouter.post('/users', postUser);
appRouter.get('/users', userMiddlewares.isAuthenticated, getUsers);
appRouter.get('/users/:id', userMiddlewares.isAuthenticated, getUserById);
appRouter.post('/users/active', userActivation);
appRouter.post('/users/activation', userActivation);
appRouter.get('/me', userMiddlewares.isAuthenticated, getMe);
appRouter.put('/users/:userId', [userMiddlewares.isAuthenticated, userMiddlewares.userInParamsIsCurrentUser], updateUser);
appRouter.delete('/users/:userId', [userMiddlewares.isAuthenticated, userMiddlewares.userInParamsIsCurrentUser], deleteUser);

/*   AUTH   */
appRouter.post('/auth', userAuthentication);
appRouter.post('/auth/refresh', refreshUserToken);
appRouter.post('/logout', logout);

/*   IMAGES   */
appRouter.post('/images', [userMiddlewares.isAuthenticated, userMiddlewares.isAdmin], postImage);
appRouter.get('/images/:id', getOneImageById);
appRouter.get('/images', getAllImages);
appRouter.delete('/images/:id', [userMiddlewares.isAuthenticated, userMiddlewares.isAdmin], deleteImageById);

/*  CARDS */
appRouter.get('/cards', [userMiddlewares.isAuthenticated], getUserCards);
appRouter.post('/cards', userMiddlewares.isAuthenticated, linkUserCard);
appRouter.delete('/cards/:cardId', userMiddlewares.isAuthenticated, removeCard);
appRouter.put('/cards/default/:cardId', userMiddlewares.isAuthenticated, setDefaultCard);

/*   STRIPE   */
appRouter.post('/stripe/pay', userMiddlewares.isAuthenticated, pay);

/*   TICKET   */
appRouter.post('/tickets', [userMiddlewares.isAuthenticated, userMiddlewares.isAdmin], createTicket);
appRouter.get('/tickets', [userMiddlewares.isAuthenticated], getTickets);
appRouter.get('/ticket/:id', [userMiddlewares.isAuthenticated], getTicketById);
appRouter.put('/ticket/:id', [userMiddlewares.isAuthenticated, userMiddlewares.isAdmin], updateTicketById);
appRouter.delete('/ticket/:id', [userMiddlewares.isAuthenticated, userMiddlewares.isAdmin], deleteTicketById);

export default (): Router => appRouter;
