const {response} = require('express');
const { v4: uuidv4 } = require('uuid');
const { updateImage } = require('../helpers/update-image');
const path = require('path');
const fs = require('fs');

const uploadFile = (req, res = response) => {

    const type = req.params.type;
    const id = req.params.id

    // validate type
    const validTypes = ['hospitals','doctors','users'];
    if( !validTypes.includes(type) ){
        return res.status(400).json({
            ok: false,
            msg: 'type is not a hospital, doctor or user'
        });
    }

    // validate that file exists
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:true,
            msg: "there's no file"
        });
      }
    
    // process image
    const file = req.files.image;
    
    const cutedName = file.name.split('.'); //
    const fileExtension = cutedName[cutedName.length - 1];

    // validate file extension
    const validExtensions = ['png','jpg','jpeg','gif'];
    if( !validExtensions.includes(fileExtension)){
        return res.status(400).json({
            ok:true,
            msg: "extension not allowed"});
    }
    
    // generate file name
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // path to save image
    const path = `./uploads/${type}/${fileName}`;

    // move image
    file.mv(path, (err) => {
        if (err){
            console.log(err)
            return res.status(500).json({
                ok: false,
                msg: 'failed to move image'
            });
        }
        
        // update database
        updateImage(type, id, fileName);

        res.json({
            ok: true,
            msg: 'file uploaded',
            fileName
        });
      });
}

const returnImage = (req, res = response) => {

    const type = req.params.type;
    const picture = req.params.picture;

    const imgPath = path.join(__dirname, `../uploads/${type}/${picture}`);
    
    // default picture
    if(fs.existsSync(imgPath)){
        res.sendFile(imgPath);
    } else {
        const imgPath = path.join(__dirname, `../uploads/noimage.png`);
        res.sendFile(imgPath);
    }
    
}

module.exports = {
    uploadFile,
    returnImage
} 