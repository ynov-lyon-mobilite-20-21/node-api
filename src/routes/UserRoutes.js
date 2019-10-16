const router = require('express').Router();

const MongooseService = require('../services/MongooseService')
const UserService = MongooseService('User');

const createUser = (req, res) => {
    //@TODO UserService Create Function
};

const deleteUser = (req, res) => {
    //@TODO UserService Delete Function
};

const updateUser = (req, res) => {
    //@TODO UserService Update Function
};

const getUserById = (req, res) => {
    //@TODO UserService GetOneBy Function
    //  EXAMPLE :
    const id = req.params.userId

    UserService.getOneBy({ _id: id })
};

router.post('/user', createUser);
router.get('/user/:id', getUserById);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

module.exports = router;
