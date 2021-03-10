import { Router } from 'express';
import {
  createNewUser_post,
  activateUser_get,
  getCurrentUserInfos_get,
  getUsersInfos_get,
  getUserInfosById_get,
  updateCurrentUserInfos_put,
  updateUserInfosById_put,
  deleteUserById_delete, deleteCurrentUser_delete,
} from './controllers/UserController';
import { authMiddlewares } from './services/AuthService';
import { logout_post, refreshUserToken_post, login_post } from './controllers/AuthController';
import {
  deleteImageById, getAllImages, getOneImageById, postImage,
} from './controllers/ImageController';
import {
  getCurrentUserCards, linkCardToCurrentUser, pay, removeCardForCurrentUser, setDefaultCardForCurrentUser,
} from './controllers/StripeController';
import {
  createNewEvent_post, deleteEventById_delete, getEventById_get, getAllEvents_get, updateEventById_put, pay_post,
} from './controllers/EventController';
import {
  createTicket,
  deleteTicketById,
  getTicketById,
  getTickets,
  updateTicketById,
} from './controllers/TicketController';

const appRouter: Router = Router();

// Setup cacheability to all routes
// @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
// use `.set('name', 'value')` on the final response to overwrite this definition
appRouter.use((req, res, next) => {
  const period = 60 * 5;

  if (req.method === 'GET') {
    res.set('Cache-control', `public, max-age=${period}`);
  } else {
    res.set('Cache-control', 'no-store, max-age=0');
  }

  // remember to call next() to pass on the request
  next();
});

/*   USERS   */
appRouter.post('/users', createNewUser_post); // CREATE / Register user
appRouter.get('/users/activate/:activationKey', activateUser_get); // Validate user (email)
appRouter.get('/users/me', [authMiddlewares.isAuthenticated], getCurrentUserInfos_get); // Get current user informations
appRouter.get('/users', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], getUsersInfos_get); // Get all users for admins
appRouter.get('/users/:id', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], getUserInfosById_get); // Get user by ID for admins
appRouter.put('/users', [authMiddlewares.isAuthenticated], updateCurrentUserInfos_put); // Update current user informations
appRouter.put('/users/:userId', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], updateUserInfosById_put); // Update one user by ID for admins
appRouter.delete('/users', [authMiddlewares.isAuthenticated], deleteCurrentUser_delete); // Delete current user
appRouter.delete('/users/:userId', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], deleteUserById_delete); // Delete user by ID for admins

/*   AUTH   */
appRouter.post('/auth/login', login_post); // Login user
appRouter.post('/auth/refreshToken', refreshUserToken_post); // Generate new tokens
appRouter.post('/auth/logout', logout_post); // Delete tokens

/*   EVENTS   */
appRouter.post('/events', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], createNewEvent_post); // Create nwe event
appRouter.get('/events', [], getAllEvents_get); // Get all events
appRouter.get('/events/:id', [], getEventById_get); // Get event informations by ID
appRouter.put('/events/:id', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], updateEventById_put); // Update event informations by ID
appRouter.delete('/events/:id', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], deleteEventById_delete); // Delete event by ID

/* STRIPE */
appRouter.post('/stripe/credit-cards', [authMiddlewares.isAuthenticated], linkCardToCurrentUser); // Create new stripe credit card (link it to current user)
appRouter.get('/stripe/credit-cards', [authMiddlewares.isAuthenticated], getCurrentUserCards); // Read all credit cards of current user
// appRouter.get('/stripe/credit-cards', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], getUserCards); // Read all credit cards TODO: create this route
appRouter.put('/stripe/credit-cards/set-default/:cardId', authMiddlewares.isAuthenticated, setDefaultCardForCurrentUser); // Update default credit card of the current user
appRouter.delete('/stripe/credit-cards/:cardId', authMiddlewares.isAuthenticated, removeCardForCurrentUser); // Delete a card by ID

// appRouter.post('/stripe/pay', [authMiddlewares.isAuthenticated], pay); // Create new payment

/*   TICKET   */
appRouter.post('/tickets', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], createTicket); // Create a ticket
appRouter.get('/tickets', [authMiddlewares.isAuthenticated], getTickets); // Get all tickets of current user
// appRouter.get('/tickets', [authMiddlewares.isAuthenticated], getTickets); // Get all tickets
appRouter.get('/ticket/:id', [authMiddlewares.isAuthenticated], getTicketById); // Get ticket informations by ID
appRouter.put('/ticket/:id', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], updateTicketById); // Update a ticket by ID
appRouter.delete('/ticket/:id', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], deleteTicketById); // Delete a ticket by ID

/*   IMAGES   */
// appRouter.post('/images', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], postImage);
// appRouter.get('/images/:id', getOneImageById);
// appRouter.get('/images', getAllImages);
// appRouter.delete('/images/:id', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], deleteImageById);

export default (): Router => appRouter;
