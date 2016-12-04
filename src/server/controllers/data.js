const requestify = require('requestify');
const knex = require('../db/connection');

const url = 'http://www.civicdata.com/api/action/datastore_search?resource_id=d914e871-21df-4800-a473-97a2ccdf9690&limit=5';

function getPermitData(){
  return requestify.get(url);
}

function filterJson(data){
  const filteredData = data.map(datum => {return { _id: datum._id, OriginalAddress: datum.OriginalCity, OriginalZip: datum.OriginalZip, AppliedDate: datum.AppliedDate, EstProjectCost: datum.EstProjectCost, LAT: datum.LAT, LON: datum.LON, Fee: datum.Fee
  };});

  return filteredData;
}

function insertPermitData(data) {
  return knex('permits').insert(data);
}

module.exports = {
  getPermitData,
  filterJson,
  insertPermitData
};
