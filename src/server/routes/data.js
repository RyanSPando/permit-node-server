const express = require('express');
const router = express.Router();

const dataController = require('../controllers/data.js');

router.get('/updatePermitData', function (req, res, next) {
  const promise = dataController.getPermitData()
  .then(function(response) {
      const result = response.getBody().result;
      const filteredJson = dataController.filterJson(result.records);
      const psqlResponse = dataController.insertPermitData(filteredJson);
      psqlResponse.then(response => res.json(response));
  }).catch(err => next(err));


});
module.exports = router;
