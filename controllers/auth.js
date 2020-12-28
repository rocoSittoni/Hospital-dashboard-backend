const { response } = require("express");
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const login = async( req, res = response) => {

    const { email, password } = req.body;

    try {
        
        // check email
        const userDB = await User.findOne({ email });

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'email or password incorrect'
            });
        }

        // check password
        const validPassword = bcrypt.compareSync(password, userDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'wrong password'
            });
        }

        // generate the token - JWT
        const token = await generateJWT(userDB.id);

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'talk to an administrator'
        });
    }

}

module.exports = {
    login
}