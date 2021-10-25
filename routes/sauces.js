const express = require('express')
const router = express.Router();

const saucesCtrl = require('../controllers/sauces') ;

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


//warn : put multer middleware after auth to be sure that the request is authentifiate
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);


module.exports = router;