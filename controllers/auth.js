const { response } = require("express");
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require("../helpers/google-verify");
const user = require("../models/user");
const { getFrontendMenu } = require("../helpers/frontend-menu");

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
            token,
            menu: getFrontendMenu(userDB.role)
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'talk to an administrator'
        });
    }

}

const googleSignIn = async(req, res = response) => {
    const googleToken = req.body.token;
    try {
        const {name, email, picture} = await googleVerify(googleToken);
        const userDB = await User.findOne({email});
        let user;
        if (!userDB) {
            user = new User({
                name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        }  else {
            user = userDB;
            user.google = true;
        }

        await user.save()
        
        //generate the token - JWT
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            token,
            menu: getFrontendMenu(user.role)       
        });
        
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: "invalid token",       
        });
    }
}

const renewToken = async(req, res = response) => {
    const uid = req.uid;
    const token = await generateJWT(uid);
    const user = await User.findById(uid);
    res.json({
        ok: true,
        token,
        user,
        menu: getFrontendMenu(user.role)
        
    });
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}