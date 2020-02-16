import { Router } from 'express';
import {getMe, getUserById, getUsers, postUser, updateUser, userActivation} from "./Controllers/UserController";
import {userMiddlewares} from "./Services/UserService";
import {refreshUserToken, userAuthentication} from "./Controllers/AuthController";
import {getOneProductById, postProduct, getAllProducts, deleteProductById} from "./Controllers/ProductController";
import {deleteImageById, getAllImages, getOneImageById, postImage} from "./Controllers/ImageController";

const exRouter: Router = Router();

    /*   USERS   */
exRouter.post('/users', postUser);
exRouter.get('/users', userMiddlewares.isAuthenticated , getUsers);
exRouter.get('/users/:id', userMiddlewares.isAuthenticated, getUserById);
exRouter.get('/users/activation', userActivation);
exRouter.get('/me', userMiddlewares.isAuthenticated, getMe);
exRouter.put('/users/admin/:userId', [ userMiddlewares.isAuthenticated, userMiddlewares.isAdmin ], updateUser);
exRouter.put('/users/:userId', [ userMiddlewares.isAuthenticated, userMiddlewares.userInParamsIsCurrentUser ], updateUser);

    /*   AUTH   */
exRouter.post('/auth', userAuthentication);
exRouter.post('/auth/refresh', refreshUserToken);

    /*   PRODUCTS   */
exRouter.post('/products', [ userMiddlewares.isAuthenticated, userMiddlewares.isAdmin], postProduct );
exRouter.get('/products/id', getOneProductById);
exRouter.get('/products', getAllProducts);
exRouter.delete('/products/id', [ userMiddlewares.isAuthenticated, userMiddlewares.isAdmin], deleteProductById);

    /*   IMAGES   */
exRouter.post('/images', [ userMiddlewares.isAuthenticated, userMiddlewares.isAdmin], postImage );
exRouter.get('/images/id', getOneImageById);
exRouter.get('/images', getAllImages);
exRouter.delete('/images/id', [ userMiddlewares.isAuthenticated, userMiddlewares.isAdmin], deleteImageById);

export default (): Router => exRouter;
