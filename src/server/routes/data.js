const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data.js');

router.get('/updatePermitData', function (req, res, next) {
  dataController.getLastRecord()
  .then(record => {
    const promise = dataController.getPermitData(record[0].max)
    .then(function(response) {
        const result = response.getBody().result.records;
        const filteredJson = dataController.filterJson(result);
        dataController.geoCode(filteredJson)
        .then(geoCoded => {
          dataController.insertPermitData(geoCoded)
          .then(response => res.json(response));
        });
    }).catch(err => next(err));
  });
});
module.exports = router;
