const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations');
const ctrlReviews = require('../controllers/reviews');

router.route('/locations')
    .get(ctrlLocations.listByDistance)
    .post(ctrlLocations.create);

router.route('/locations/:locationId')
    .get(ctrlLocations.readOne)
    .put(ctrlLocations.updateOne)
    .delete(ctrlLocations.deleteOne);

router.route('/locations/:locationId/reviews')
    .post(ctrlReviews.create);

router.route('/locations/:locationId/reviews/:reviewId')
    .get(ctrlReviews.readOne)
    .put(ctrlReviews.updateOne)
    .delete(ctrlReviews.deleteOne);

module.exports = router;
