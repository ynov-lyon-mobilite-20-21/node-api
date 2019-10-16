const router = require('express').Router();

const UserRouter = require('./UserRoutes');
const AuthRouter = require('./AuthRoutes');

router('/api', UserRouter);
router('/api', AuthRouter);

module.exports = router
