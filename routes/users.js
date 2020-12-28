// Route: /api/users

const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');

const { getUsers, createUsers, updateUser, deleteUser } = require('../controllers/users');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();


router.get( '/', validateJWT ,getUsers);

router.post( '/',
    [
        check('name', 'the name is required').not().isEmpty(),
        check('password', 'the password is required').not().isEmpty(),
        check('email', 'the email is required').isEmail(),
        validateFields
    ],
    createUsers );

router.put( '/:id',
    [
        validateJWT,
        check('name', 'the name is required').not().isEmpty(),
        check('email', 'the email is required').isEmail(),
        check('role', 'the role is required').not().isEmpty(),
        validateFields
    ],
    updateUser);

router.delete( '/:id',
    validateJWT,
    deleteUser
);

module.exports = router;