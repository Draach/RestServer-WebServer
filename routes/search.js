const { Router } = require('express');
const { searchDB } = require('../controllers/search');

const router = Router();


router.get('/:collection/:term', searchDB)


module.exports = router;