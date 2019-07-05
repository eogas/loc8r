const request = require('request');

const apiOptions = {
    server: 'http://localhost:3000'
};

if (process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://gentle-fortress-68805.herokuapp.com/';
}

const renderHomepage = (req, res, body) => {
    let message = null;

    if (!(body instanceof Array)) {
        message = 'API lookup error';
        body = {};
    }
    else if (!body.length) {
        message = 'No places found nearby'
    }

    res.render('locations-list', {
        title: 'Loc8r - find a place to work with wifi',
        sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about.',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        locations: body,
        message: message
    });
};

const formatDistance = (distance) => {
    let thisDistance = 0;
    let unit = 'm';

    if (distance > 1000) {
        thisDistance = (distance / 1000.0).toFixed(1);
        unit = 'km';
    }
    else {
        thisDistance = Math.floor(distance);
    }

    return `${thisDistance} ${unit}`;
};

const homelist = (req, res) => {
    const path = '/api/locations';
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {},
        qs: {
            lng: -0.7992599,
            lat: 51.378091,
            maxDistance: 2000000
        }
    };

    request(requestOptions, (err, response, body) => {
        let data = null;

        if (response.statusCode == 200) {
            data = [];
            
            if (body.length) {
                data = body.map(location => {
                    location.distance = formatDistance(location.distance);
                    return location;
                });
            }
        }

        renderHomepage(req, res, data);
    });
};

const locationInfo = (req, res) => {
    res.render('location-info', {
        title: 'Location info',
        location: {
            name: 'Starcups',
            address: '125 High Street, Reading RG6 1PS',
            rating: 3,
            facilities:[
                'Hot Drinks',
                'Food',
                'Premium wifi'
            ],
            distance: '100m',
            hours: [
                'Monday - Friday : 7:00am - 7:00pm',
                'Saturday : 8:00am - 5:00pm',
                'Sunday : closed'
            ],
            // The book recommends just passing the long/lat, but I want to construct the whole URI in the controller
            // so I can calculate the API signature on the fly, server side
            mapUri: 'https://maps.googleapis.com/maps/api/staticmap?center=51.455041,-0.9690884&zoom=17&size=400x350&sensor=false&markers=51.455041,-0.9690884&scale=2&key=AIzaSyCdUIbWu-0_w9uAEjbMQ4ABk7H_uQwu4vg&signature=bIBB8tGSIgwB0Liom_teLSUpShE=',
            reviews: [{
                author: 'Simon Holmes',
                rating: 5,
                timestamp: '16 February 2017',
                comment: 'What a great place.'
            }, {
                author: 'Charlie Chaplain',
                rating: 3,
                timestamp: '14 February 2017',
                comment: 'It was okay. Coffee wasn\'t great.'
            }]
        },
        sidebarLead: 'Starcups is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
        sidebarSubtext: 'If you\'ve been here and you like it - or if you don\'t - please leave a review to help people just like you.'
    });
};

const addReview = (req, res) => {
    res.render('location-review-form', {
        title: 'Add review',
        pageHeader: {
            title: 'Review Starcups'
        }
    });
};

module.exports = {
    homelist,
    locationInfo,
    addReview
};
