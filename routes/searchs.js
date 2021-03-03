// route: api/all/:search

const {Router} = require('express');
const {getAll, getDocumentsCollection} = require('../controllers/searchs');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/:search', validateJWT, getAll);
router.get('/collection/:table/:search', validateJWT, getDocumentsCollection);

module.exports = router;