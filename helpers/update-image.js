const User = require('../models/user');
const Doctor = require('../models/doctors');
const Hospital = require('../models/hospitals');
const fs = require('fs');

const deleteImage = (path) => {
    if(fs.existsSync(path)){
    // delete previous image
        fs.unlinkSync(path);
    }
}

const updateImage = async(type, id, fileName) => {
    
    let oldPath = '';
    
    switch(type){
        case 'doctors':
            const doctor = await Doctor.findById(id);
            if(!doctor){
                console.log('cant find doctor by id');
                return false;
            }
            
            oldPath = `./uploads/doctors/${doctor.img}`
            deleteImage(oldPath);

            doctor.img = fileName;
            await doctor.save();
            return true;
        break;

        case 'hospitals':
            const hospital = await Hospital.findById(id);
            if(!hospital){
                console.log('cant find hospital by id');
                return false;
            }
            
            oldPath = `./uploads/hospitals/${hospital.img}`
            deleteImage(oldPath);

            hospital.img = fileName;
            await hospital.save();
            return true;
        break;

        case 'users':
            const user = await User.findById(id);
            if(!user){
                console.log('cant find user by id');
                return false;
            }
            
            oldPath = `./uploads/users/${user.img}`
            deleteImage(oldPath);

            user.img = fileName;
            await user.save();
            return true;
        break;
    }

}

module.exports = {
    updateImage
}