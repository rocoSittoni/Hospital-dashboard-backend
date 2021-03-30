const jwt = require('jsonwebtoken');
const User = require('../models/user');


const validateJWT = (req, res, next) => {

    // read token
    const token = req.header('x-token');
    
    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'there is no token in the request' 
        });
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.JWT_SECRET);
        req.uid = uid
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'invalid token'
        });
    }

}

const validateAdminRole = async(req, res, next) => {

    const uid = req.uid;

    try{
    const userDB = await User.findById(uid);
    if(!userDB){
        return res.status(404).json({
            ok: false,
            msg: 'User doesnt exists'
        });
    }
    if (userDB.role !== 'ADMIN_ROLE'){
        return res.status(403).json({
            ok: false,
            msg: 'User doesnt exists'
        });
    }
    next();

    } catch {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'talk to an administrator'
        })
    }

}

const validateAdminRole_or_sameUser = async(req, res, next) => {

    const uid = req.uid;
    const id = req.params.id;

    try{
    const userDB = await User.findById(uid);
    if(!userDB){
        return res.status(404).json({
            ok: false,
            msg: 'User doesnt exists'
        });
    }
    if (userDB.role !== 'ADMIN_ROLE' && uid !== id){
        return res.status(403).json({
            ok: false,
            msg: 'User doesnt exists'
        });
    }
    next();

    } catch {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'talk to an administrator'
        })
    }

}

module.exports = {
    validateJWT,
    validateAdminRole,
    validateAdminRole_or_sameUser
}