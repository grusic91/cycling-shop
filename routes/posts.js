const express = require('express');
const router = express.Router();

/* GET posts. */
router.get('/',(req, res, next) => {
  res.render('index', { title: 'Cycling Shop - Home' });
});

module.exports = router;
