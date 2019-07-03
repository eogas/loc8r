const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

const doSetAverageRating = (location) => {
    if (!location.reviews || location.reviews.length <= 0) {
        return;
    }

    const count = location.reviews.length;
    const total = location.reviews.reduce((acc, {rating}) => {
        return acc + rating;
    }, 0);

    location.rating = parseInt(total / count, 10);

    location.save((err, location) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log(`Average rating updated to ${location.rating} for location ${location._id}`);
    })
};

const updateAverageRating = (locationId) => {
    Loc.findById(locationId).select('rating reviews').exec((err, location) => {
        if (err) {
            return; // uh oh
        }

        doSetAverageRating(location);
    });
};

const doAddReview = (req, res, location) => {
    const { author, rating, reviewText } = req.body;

    location.reviews.push({
        author: author,
        rating: rating,
        reviewText: reviewText
    });

    location.save((err, location) => {
        if (err) {
            res.status(400).json(err);
            return;
        }

        updateAverageRating(location._id);

        let thisReview = location.reviews[location.reviews.length - 1];
        res.status(201).json(thisReview);
    });
};

const create = (req, res) => {
    const locationId = req.params.locationId;

    if (!locationId) {
        res.status(404).json({
            message: 'Location not found'
        });
    }

    Loc.findById(locationId).select('reviews').exec((err, location) => {
        if (err) {
            res.status(400).json(err);
            return;
        }

        if (!location) {
            res.status(404).json({
                message: 'Location not found'
            });
            return;
        }

        doAddReview(req, res, location);
    });
};

const readOne = (req, res) => {
    const locationId = req.params.locationId;
    const reviewId = req.params.reviewId;

    Loc.findById(locationId)
        .select('name reviews')
        .exec((err, location) => {
            if (err) {
                return res.status(404).json(err);
            }
    
            if (!location) {
                return res.status(404).json({
                    'message': 'location not found'
                });
            }

            if (!location.reviews || location.reviews.length <= 0) {
                return res.status(404).json({
                    'message': 'no reviews found'
                });
            }

            const review = location.reviews.id(reviewId);

            if (!review) {
                return res.status(404).json({
                    'message': 'review not found'
                });
            }

            return res.status(200).json({
                location: {
                    name: location.name,
                    id: locationId
                },
                review
            });
        });
};

const updateOne = (req, res) => {
    const locationId = req.params.locationId;
    const reviewId = req.params.reviewId;
    const data = req.body;

    if (!locationId || !reviewId) {
        return res.status(400).json({
            message: 'locationId and reviewId are required'
        });
    }

    Loc.findById(locationId).select('reviews').exec((err, location) => {
        if (err) {
            res.status(400).json(err);
            return;
        }

        if (!location) {
            res.status(404).json({
                message: 'Location not found'
            });
            return;
        }

        if (!location.reviews || location.reviews.length <= 0) {
            res.status(404).json({
                message: 'No reviews found to update'
            });
            return;
        }

        const review = location.reviews.id(reviewId);

        if (!review) {
            res.status(404).json({
                message: 'Review not found'
            });
            return;
        }

        review.author = data.author;
        review.rating = data.rating;
        review.reviewText = data.reviewText;

        location.save((err, location) => {
            if (err) {
                res.status(400).json(err);
                return;
            }

            updateAverageRating(location._id);
            res.status(200).json(review);
        });
    });
};

const deleteOne = (req, res) => {
    const { locationId, reviewId } = req.params;

    if (!locationId || !reviewId) {
        return res.status(400).json({
            message: 'locationId and reviewId are required'
        });
    }

    Loc.findById(locationId).select('reviews').exec((err, location) => {
        if (err) {
            res.status(400).json(err);
            return;
        }

        if (!location) {
            res.status(404).json({
                message: 'Location not found'
            });
            return;
        }

        if (!location.reviews || location.reviews.length <= 0) {
            res.status(404).json({
                message: 'No reviews to delete'
            });
            return;
        }

        location.reviews.id(reviewId).remove();
        location.save(err => {
            if (err) {
                res.status(400).json(err);
                return;
            }

            updateAverageRating(location._id);
            res.status(204).json(null);
        });
    });
};

module.exports = {
    create,
    readOne,
    updateOne,
    deleteOne
};
