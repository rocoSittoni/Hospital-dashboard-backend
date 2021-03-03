// route: /api/uploads

const {Router} = require('express');
const fileUpload = require('express-fileupload');
const { uploadFile, returnImage } = require('../controllers/uploads');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.use(fileUpload());  

router.put('/:type/:id', validateJWT, uploadFile);

router.get('/:type/:picture', returnImage);

module.exports = router;