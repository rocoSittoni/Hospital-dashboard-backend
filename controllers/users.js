const { response, json } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async(req, res) => {

const from = Number(req.query.from) || 0;
const [users, total] = await Promise.all([
        User
            .find({},'name email role google img')
            .skip(from)
            .limit(5),
        User.countDocuments()
    ]);
    res.json({
        ok: true,
        users,
        total
        // uid: req.uid
    });
}

const createUsers = async(req, res = response) => {

    const {email, password, name} = req.body; 

    try {
        const mailExists = await User.findOne({email});

        if( mailExists ){
            return res.status(400).json({
                ok: false,
                msg: 'that mail is already in use'
            });
        }

        const user = new User(req.body);

        // encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        // save user
        await user.save();

        // generate JWT
        const token = await generateJWT(user.id);
    
        res.json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500),json({
            ok: false,
            msg: 'error... check logs'
        });
    }
}

const updateUser = async (req, res = response) => {

    // ToDo: validate token and check correct user

    const uid = req.params.id;

    try {

        const userDB = await User.findById(uid);
        if( !userDB ){
            return res.status(404).json({
                ok: false,
                msg: 'there is no user for that id'
            });
        }

        // updates
        const { password, google, email, ...fields} = req.body;
        if ( userDB.email !== email ) {
 
            const mailExist = await User.findOne({ email });
            if (mailExist){
                return res.status(400).json({
                    ok:false,
                    msg: 'there is already a user with that email'
                });
            }
        }
        fields.email = email;
        const updatedUser = await User.findByIdAndUpdate( uid, fields, { new:true } );
 
        res.json({
            ok: true,
            user: updatedUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'unespected error'
        })
    }

} 

const deleteUser = async (req, res = response) => {

    const uid = req.params.id;

    try {
 
        const userDB = await User.findById(uid);
        if( !userDB ){
            return res.status(404).json({
                ok: false,
                msg: 'there is no user for that id'
            });
        }
        await User.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'User deleted'
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
    getUsers,
    createUsers,
    updateUser,
    deleteUser
}