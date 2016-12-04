const requestify = require('requestify');
const knex = require('../db/connection');
var geocoder = require('node-geocoder')({provider: 'google'});

function getPermitData(record) {

  const url = `http://www.civicdata.com/api/action/datastore_search_sql?sql=SELECT * from "d914e871-21df-4800-a473-97a2ccdf9690" WHERE _id > ${record} ORDER BY _id`;
  return requestify.get(url);
}

function filterJson(data) {
  return data.map(row => {
    return {
      _id: row._id,
      OriginalCity: row.OriginalCity,
      OriginalZip: row.OriginalZip,
      AppliedDate: row.AppliedDate,
      EstProjectCost: row.EstProjectCost,
      LAT: row.LAT,
      LON: row.LON,
      Fee: row.Fee
    };
  });
}

function insertPermitData(data) {
  return knex('permits').insert(data);
}

function geoCode(data) {
  let promises = data.map(row => {
    if (row.LAT || row.LON) {
      return geocoder.reverse({lat: row.LAT, lon: row.LON});
    }
    else {
      return null;
    }
  });

  return Promise.all(promises).then(location => {
    const updatedGeo = data.map((row, index) => {
      if (row.OriginalCity === '' && row.LAT) {
        row.OriginalCity = location[index][0].city;
        row.OriginalZip = location[index][0].zipcode;
        return row;
      }
      else {
        return row;
      }
    });
    return updatedGeo;
  });
}

function getLastRecord() {
  return knex('permits').max('_id');
}

module.exports = {
  getPermitData,
  filterJson,
  insertPermitData,
  geoCode,
  getLastRecord
};
