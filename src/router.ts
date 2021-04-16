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
  getCurrentUserCards,
  linkCardToCurrentUser,
  removeCardForCurrentUser,
  setDefaultCardForCurrentUser,
  webhookInvoice,
  webhookPaymentIntent,
} from './controllers/StripeController';
import {
  createNewEvent, deleteEventById, getEventById, getAllEvents, updateEventById, pay,
} from './controllers/EventController';
import {
  createTicket,
  deleteTicketById,
  getTicketById,
  getCurrentUserTickets,
  updateTicketById, getTickets, getCurrentUserTicketById, checkTicketById,
} from './controllers/TicketController';
import { appleSiteAssociation } from './controllers/AppleController';

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
appRouter.post('/api/users', createNewUser); // CREATE / Register user
appRouter.get('/api/users/activate/:activationKey', activateUser); // Validate user (email)
appRouter.get('/api/users/me', [authMiddlewares.isAuthenticated], getCurrentUserInfos); // Get current user informations
appRouter.get('/api/users', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], getUsersInfos); // Get all users for admins
appRouter.get('/api/users/:id', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], getUserInfosById); // Get user by ID for admins
appRouter.put('/api/users', [authMiddlewares.isAuthenticated], updateCurrentUserInfos); // Update current user informations
appRouter.put('/api/users/:userId', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], updateUserInfosById); // Update one user by ID for admins
appRouter.delete('/api/users', [authMiddlewares.isAuthenticated], deleteCurrentUser); // Delete current user
appRouter.delete('/api/users/:userId', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], deleteUserById); // Delete user by ID for admins

/*   AUTH   */
appRouter.post('/api/auth/login', login); // Login user
appRouter.post('/api/auth/refreshToken', refreshUserToken); // Generate new tokens
appRouter.post('/api/auth/logout', logout); // Delete tokens

/*   EVENTS   */
appRouter.post('/api/events', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], createNewEvent); // Create new event
appRouter.get('/api/events', [], getAllEvents); // Get all events
appRouter.get('/api/events/:id', [], getEventById); // Get event informations by ID
appRouter.put('/api/events/:id', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], updateEventById); // Update event informations by ID
appRouter.delete('/api/events/:id', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], deleteEventById); // Delete event by ID
appRouter.post('/api/events/pay/:id', [authMiddlewares.isAuthenticated], pay); // Buy a ticket

/* STRIPE */
appRouter.post('/api/stripe/webhook/payment_intent', [], webhookPaymentIntent); // handle payment events
appRouter.post('/api/stripe/webhook/invoice', [], webhookInvoice); // handle payment events
appRouter.post('/api/stripe/credit-cards', [authMiddlewares.isAuthenticated], linkCardToCurrentUser); // Create new stripe credit card (link it to current user)
appRouter.get('/api/stripe/credit-cards/me', [authMiddlewares.isAuthenticated], getCurrentUserCards); // Read all credit cards of current user
appRouter.put('/api/stripe/credit-cards/set-default/:cardId', authMiddlewares.isAuthenticated, setDefaultCardForCurrentUser); // Update default credit card of the current user
appRouter.delete('/api/stripe/credit-cards/:cardId', authMiddlewares.isAuthenticated, removeCardForCurrentUser); // Delete a card by ID

// appRouter.post('/s/apitripe/pay', [authMiddlewares.isAuthenticated], pay); // Create new payment

/*   TICKET   */
appRouter.post('/api/tickets', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], createTicket); // Create a ticket
appRouter.get('/api/tickets/me', [authMiddlewares.isAuthenticated], getCurrentUserTickets); // Get all tickets of current user
appRouter.get('/api/tickets', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], getTickets); // Get all tickets
appRouter.get('/api/ticket/:id/me', [authMiddlewares.isAuthenticated], getCurrentUserTicketById); // Get ticket informations by ID
appRouter.get('/api/ticket/:id', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], getTicketById); // Get ticket informations by ID
appRouter.put('/api/ticket/:id', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], updateTicketById); // Update a ticket by ID
appRouter.delete('/api/ticket/:id', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], deleteTicketById); // Delete a ticket by ID
appRouter.get('/api/ticket/:id/check', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], checkTicketById); // Get ticket informations by ID

/*   IMAGES   */
// appRouter.post('/images', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], postImage);
// appRouter.get('/images/:id', getOneImageById);
// appRouter.get('/images', getAllImages);
// appRouter.delete('/images/:id', [authMiddlewares.isAuthenticated, authMiddlewares.isAdmin], deleteImageById);

/* App links */
appRouter.get('/.well-known/apple-app-site-association', [], appleSiteAssociation); // Get ticket informations by ID

export default (): Router => appRouter;
