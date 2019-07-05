let express = require('express');
let router = express.Router();
let ctrlLocations = require('../controllers/locations');
let ctrlOthers = require('../controllers/others');

// location pages
router.get('/', ctrlLocations.homelist);
router.get('/location/:locationId', ctrlLocations.locationInfo);
router.route('/location/:locationId/review/new')
    .get(ctrlLocations.addReview)
    .post(ctrlLocations.doAddReview);

// other pages
router.get('/about', ctrlOthers.about);

module.exports = router;
