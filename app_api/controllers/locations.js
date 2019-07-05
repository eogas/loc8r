const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

const listByDistance = async (req, res) => {
    const lng = parseFloat(req.query.lng);
    const lat = parseFloat(req.query.lat);
    const maxDistance = parseFloat(req.query.maxDistance);

    if ((!lng && lng !== 0) || (!lat && lat !== 0)) {
        return res.status(404).json({
            'message': 'lat and lng query params are required'
        });
    }

    const near = {
        type: 'Point',
        coordinates: [lng, lat]
    };

    const geoOptions = {
        distanceField: 'distance.calculated',
        spherical: true,
        maxDistance: maxDistance
    };

    let results = null;

    try {
        results = await Loc.aggregate([{
            $geoNear: {
                near, ...geoOptions
            }
        }]);
    }
    catch (err) {
        res.status(404).json(err);
    }

    const locations = results.map(result => {
        return {
            _id: result._id,
            name: result.name,
            address: result.address,
            rating: result.rating,
            facilities: result.facilities,
            distance: result.distance.calculated
        };
    });

    return res.status(200).json(locations);
};

const create = (req, res) => {
    const data = req.body;

    const newLoc = {
        name: data.name,
        address: data.address,
        facilities: data.facilities.split(",").map(s => s.trim()),
        coords: [
            parseFloat(data.lng),
            parseFloat(data.lat)
        ],
        openingTimes: [{
            days: data.days1,
            opening: data.opening1,
            closing: data.closing1,
            closed: data.closed1
        }, {
            days: data.days2,
            opening: data.opening2,
            closing: data.closing2,
            closed: data.closed2
        }]
    };

    Loc.create(newLoc, (err, location) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(201).json(location);
        }
    });
};

const readOne = (req, res) => {
    const id = req.params.locationId;

    Loc.findById(id).exec((err, location) => {
        if (err) {
            return res.status(404).json(err);
        }

        if (!location) {
            return res.status(404).json({
                'message': 'location not found'
            });
        } 

        res.status(200).json(location);
    });
};

const updateOne = (req, res) => {
    const locationId = req.params.locationId;
    const data = req.body;

    if (!locationId) {
        return res.status(404).json({
            message: 'Not found: locationId is required'
        });
    }

    Loc.findById(locationId).select('-reviews -rating').exec((err, location) => {
        if (err) {
            res.status(400).json(err);
            return;
        }

        if (!location) {
            res.status(404).json({
                message: 'Location not found'
            });
        }

        location.name = data.name;
        location.address = data.address;
        location.facilities = data.facilities.split(',').map(s => s.trim());
        location.coords = {
            type: 'Point',
            coordinates: [
                parseFloat(data.lng),
                parseFloat(data.lat)
            ]
        };
        location.openingTimes = [{
            days: data.days1,
            opening: data.opening1,
            closing: data.closing1,
            closed: data.closed1
        }, {
            days: data.days2,
            opening: data.opening2,
            closing: data.closing2,
            closed: data.closed2
        }];

        location.save((err, updatedLocation) => {
            if (err) {
                res.status(400).json(err);
                return;
            }
            
            res.status(200).json(updatedLocation);
        });
    });
};

const deleteOne = (req, res) => {
    const locationId = req.params.locationId;

    if (!locationId) {
        return res.status(400).json({
            message: 'locationId is required'
        });
    }

    Loc.findByIdAndRemove(locationId).exec((err, location) => {
        if (err) {
            res.status(404).json(err);
            return;
        }

        res.status(204).json(null);
    });
};

module.exports = {
    listByDistance,
    create,
    readOne,
    updateOne,
    deleteOne
};
