const requestify = require('requestify');
const knex = require('../db/connection');
var geocoder = require('node-geocoder')({provider: 'google'});

function getPermitData(record) {
  const url = `http://www.civicdata.com/api/action/datastore_search_sql?sql=SELECT * from "d914e871-21df-4800-a473-97a2ccdf9690" WHERE _id > ${record} ORDER BY _id LIMIT 20`;
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

function geoCodePSQL() {
  for (let x of take(1000, geoGen())) {
  console.log(x);
}
  // for (let i = x; i <= 20 + x; i++) {
  //   knex('permits').where({_id: i}).then(row => {
  //     if (row[0].OriginalCity === '' && row[0].LAT !== '') {
  //       geocoder.reverse({lat: row[0].LAT, lon: row[0].LON}, function(err, data) {
  //         knex('permits')
  //         .update({
  //           OriginalZip: data[0].zipcode,
  //           OriginalCity: data[0].city
  //         })
  //         .where({_id: i})
  //         .then(value => {
  //           console.log(value);
  //         });
  //       });
  //     }
  //   });
  // }
}

function* geoGen() {
  var i = 1;
  while(true) {
    try {
      let row = yield knex('permits').where({_id: i});
      console.log(row);
      // if (row[0].OriginalCity === '' && row[0].LAT !== '') {
      //   let geoCoded = yield geocoder.reverse({lat: row[0].LAT, lon: row[0].LON});
      //   yield knex('permits')
      //   .update({
      //     OriginalZip: geoCoded[0].zipcode,
      //     OriginalCity: geoCoded[0].city
      //   })
      //   .where({_id: i}, i++);
      // }
    }
    catch(err) {
      console.log(err);
    }
  }
}

function* take(n, iterable) {
  for (let x of iterable) {
    if (n <= 0) return;
    n--;
    yield x;
  }
}

function getLastRecord() {
  return knex('permits').max('_id');
}

function getPermits(searchParams) {

  if (searchParams.AppliedDate && searchParams.OriginalCity) {
    const key = 'AppliedDate';
    const search = searchParams.AppliedDate.slice(0,7) + '%' || '';
    return knex('permits')
    .where({OriginalCity: searchParams.OriginalCity})
    .where(key, 'like', search);
  }
  else if (searchParams.AppliedDate ) {
    const key = 'AppliedDate';
    const search = searchParams.AppliedDate.slice(0,7) + '%' || '';
    return knex('permits')
    .where(key, 'like', search);
  }
  else if (searchParams.OriginalCity) {
    return knex('permits')
    .where({OriginalCity: searchParams.OriginalCity});
  }
}

function radius(searchParam) {
  return knex.raw(`SELECT *, point(${searchParam.lon}, ${searchParam.lat}) <@> point(lon, lat)::point AS distance FROM permits WHERE (point(${searchParam.lon}, ${searchParam.lat}) <@> point(lon, lat)) < 3 AND "AppliedDate" LIKE '2016%';`);
}

module.exports = {
  getPermitData,
  filterJson,
  insertPermitData,
  geoCode,
  geoCodePSQL,
  getLastRecord,
  getPermits,
  radius
};
