import { Router } from 'express';
import {
  createNewUser,
  activateUser,
  getCurrentUserInfos,
  getUsersInfos,
  getUserInfosById,
  updateCurrentUserInfos,
  updateUserInfosById,
  deleteUserById, deleteCurrentUser,
} from './controllers/UserController';
import { authMiddlewares } from './services/AuthService';
import { logout, refreshUserToken, login } from './controllers/AuthController';
import {
  getCurrentUserCards, linkCardToCurrentUser, removeCardForCurrentUser, setDefaultCardForCurrentUser,
} from './controllers/StripeController';
import {
  createNewEvent, deleteEventById, getEventById, getAllEvents, updateEventById, pay,
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
appRouter.post('/users', createNewUser); // CREATE / Register user
appRouter.get('/users/activate/:activationKey', activateUser); // Validate user (email)
appRouter.get('/users/me', [authMiddlewares.isAuthenticated], getCurrentUserInfos); // Get current user informations
appRouter.get('/users', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], getUsersInfos); // Get all users for admins
appRouter.get('/users/:id', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], getUserInfosById); // Get user by ID for admins
appRouter.put('/users', [authMiddlewares.isAuthenticated], updateCurrentUserInfos); // Update current user informations
appRouter.put('/users/:userId', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], updateUserInfosById); // Update one user by ID for admins
appRouter.delete('/users', [authMiddlewares.isAuthenticated], deleteCurrentUser); // Delete current user
appRouter.delete('/users/:userId', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], deleteUserById); // Delete user by ID for admins

/*   AUTH   */
appRouter.post('/auth/login', login); // Login user
appRouter.post('/auth/refreshToken', refreshUserToken); // Generate new tokens
appRouter.post('/auth/logout', logout); // Delete tokens

/*   EVENTS   */
appRouter.post('/events', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], createNewEvent); // Create nwe event
appRouter.get('/events', [], getAllEvents); // Get all events
appRouter.get('/events/:id', [], getEventById); // Get event informations by ID
appRouter.put('/events/:id', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], updateEventById); // Update event informations by ID
appRouter.delete('/events/:id', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], deleteEventById); // Delete event by ID
appRouter.post('/events/pay/:id', [authMiddlewares.isAuthenticated], pay); // Buy a ticket

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
