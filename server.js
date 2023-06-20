var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Vehicle = require('./app/models/vehicle');

// Configure app to use body-parser
// Grab data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set port for the server to listen on
var port = process.env.PORT || 3000;

// Connect to DB
const uri = 'mongodb+srv://kimurgorbrian20:6979samz.@cluster0.mytpcox.mongodb.net/mydatabase?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// API routes
var router = express.Router();

// Middleware to use for all requests
router.use(function (req, res, next) {
  console.log('API request made.');
  next();
});

router.route('/vehicles')
  .post(function (req, res) {
    var vehicle = new Vehicle(); // Instantiate a new Vehicle object
    vehicle.make = req.body.make;
    vehicle.model = req.body.model;
    vehicle.color = req.body.color;

    vehicle.save()
      .then(function (savedVehicle) {
        res.json({ message: 'Vehicle was successfully manufactured', vehicle: savedVehicle });
      })
      .catch(function (err) {
        res.status(500).json({ message: 'Error occurred during vehicle manufacturing', error: err });
      });
  })
  .get(function (req, res) {
    Vehicle.find()
      .then(function (vehicles) {
        res.json(vehicles);
      })
      .catch(function (err) {
        res.status(500).json({ message: 'Error occurred while retrieving vehicles', error: err });
      });
  });

router.route('/vehicle/vehicle_id')
  .get(function (req, res) {
    Vehicle.findById(req.params.vehicle_id, function (err, vehicle) {
      if (err) {
        res.send(err);
      }
      res.json(vehicle);
    });
  });

router.route('/vehicle/make/:make')
  .get(function (req, res) {
    Vehicle.find({ make: req.params.make }, function (err, vehicle) {
      if (err) {
        res.send(err);
      }
      res.json(vehicle);
    });
  });

router.route('/vehicle/color/:color')
  .get(function (req, res) {
    Vehicle.find({ color: req.params.color }, function (err, vehicle) {
      if (err) {
        res.send(err);
      }
      res.json(vehicle);
    });
  });

// Test route
router.get('/', function (req, res) {
  res.json({ message: 'Welcome to our API' });
});

// Register API routes
app.use('/api', router);

// Start the server
app.listen(port, function () {
  console.log('Server listening on port ' + port);
});
