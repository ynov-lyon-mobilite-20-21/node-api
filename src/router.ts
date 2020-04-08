import { Router } from 'express';
import {
  getMe, getUserById, getUsers, postUser, updateUser, userActivation,
} from './controllers/UserController';
import { userMiddlewares } from './services/UserService';
import { refreshUserToken, userAuthentication } from './controllers/AuthController';
import {
  getOneProductById, postProduct, getAllProducts, deleteProductById,
} from './controllers/ProductController';
import {
  deleteImageById, getAllImages, getOneImageById, postImage,
} from './controllers/ImageController';

import { getUserCards, linkUserCard, pay } from './controllers/StripeController';

const appRouter: Router = Router();

/*   USERS   */
appRouter.post('/users', postUser);
appRouter.get('/users', userMiddlewares.isAuthenticated, getUsers);
appRouter.get('/users/:id', userMiddlewares.isAuthenticated, getUserById);
appRouter.post('/users/active', userActivation);
appRouter.post('/users/activation', userActivation);
appRouter.get('/me', userMiddlewares.isAuthenticated, getMe);
appRouter.put('/users/admin/:userId', [userMiddlewares.isAuthenticated, userMiddlewares.isAdmin], updateUser);
appRouter.put('/users/:userId', [userMiddlewares.isAuthenticated, userMiddlewares.userInParamsIsCurrentUser], updateUser);
// appRouter.delete('/users/:userId', [userMiddlewares.isAuthenticated, userMiddlewares.userInParamsIsCurrentUser], updateUser);

/*   AUTH   */
appRouter.post('/auth', userAuthentication);
appRouter.post('/auth/refresh', refreshUserToken);

/*   PRODUCTS   */
appRouter.post('/products', [userMiddlewares.isAuthenticated, userMiddlewares.isAdmin], postProduct);
appRouter.get('/products/:id', getOneProductById);
appRouter.get('/products', getAllProducts);
appRouter.delete('/products/:id', [userMiddlewares.isAuthenticated, userMiddlewares.isAdmin], deleteProductById);

/*   IMAGES   */
appRouter.post('/images', [userMiddlewares.isAuthenticated, userMiddlewares.isAdmin], postImage);
appRouter.get('/images/:id', getOneImageById);
appRouter.get('/images', getAllImages);
appRouter.delete('/images/:id', [userMiddlewares.isAuthenticated, userMiddlewares.isAdmin], deleteImageById);

/*  CARDS */
appRouter.get('/cards', [userMiddlewares.isAuthenticated], getUserCards);
appRouter.post('/cards', userMiddlewares.isAuthenticated, linkUserCard);

/*   STRIPE   */
appRouter.post('/stripe/pay', userMiddlewares.isAuthenticated, pay);

export default (): Router => appRouter;
