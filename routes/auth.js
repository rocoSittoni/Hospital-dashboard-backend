// path: /api/login

const { Router } = require('express');
const { login } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post( '/',
    [
        check('email', 'email is required').isEmail(),
        check('password', 'password is required').not().isEmpty(),
        validateFields
    ],
    login
);


module.exports = router;