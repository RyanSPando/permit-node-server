const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data.js');
const data = require('./data.json');

router.get('/updatePermitData', function (req, res, next) {
  dataController.getLastRecord()
  .then(record => {
    dataController.getPermitData(record[0].max)
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

router.get('/insertData', function(req, res, next) {
  dataController.geoCodePSQL();
  res.json('Good');
});

module.exports = router;
