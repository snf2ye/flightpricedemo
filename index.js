// var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var pg = require('pg');

app.get('/', function (request, response) {
      response.render('pages/index', {results: ''} );
});

app.get('/departing', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("SELECT to_char(departure_odate, 'YYYY-MM-DD') as departure_odate, total_usd, major_carrier_id FROM departuredata", function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
      {

        var jset = {};
        for (var i = 0, len = result.rowCount; i < len; i++) {
          var dateData = {};
          dateData["price"] = result.rows[i].total_usd;
          dateData["airline"] = result.rows[i].major_carrier_id;
          jset[result.rows[i].departure_odate] = dateData;
        }
        
        response.json(jset) 
      }
    });
  });
});

app.get('/returning', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    var query = "SELECT to_char(return_odate, 'YYYY-MM-DD') as return_odate, total_usd, major_carrier_id FROM returndata";
    if(request.query.airline == "AA")
      query = query + " where major_carrier_id = 'AA'";
    else if (request.query.airline == "AC")
      query = query + " where major_carrier_id = 'AC'";
    else if (request.query.airline == "AM")
      query = query + " where major_carrier_id = 'AM'";
    else if (request.query.airline == "AS")
      query = query + " where major_carrier_id = 'AS'";
    else if (request.query.airline == "B6")
      query = query + " where major_carrier_id = 'B6'";
    else if (request.query.airline == "CM")
      query = query + " where major_carrier_id = 'CM'";
    else if (request.query.airline == "DL")
      query = query + " where major_carrier_id = 'DL'";
    else if (request.query.airline == "NK")
      query = query + " where major_carrier_id = 'NK'";
    else if (request.query.airline == "SY")
      query = query + " where major_carrier_id = 'SY'";
    else if (request.query.airline == "UA")
      query = query + " where major_carrier_id = 'UA'";
    else if (request.query.airline == "VX")
      query = query + " where major_carrier_id = 'VX'";
    else if (request.query.airline == "WS")
      query = query + " where major_carrier_id = 'WS'";

    client.query(query, function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
      {

        var jset = {};
        for (var i = 0, len = result.rowCount; i < len; i++) {
          var dateData = {};
          if(jset[result.rows[i].return_odate]) {
            dateData = jset[result.rows[i].return_odate];
          }
          dateData[result.rows[i].major_carrier_id] = result.rows[i].total_usd;
          jset[result.rows[i].return_odate] = dateData;
        }
        
        response.json(jset) 
      }
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});