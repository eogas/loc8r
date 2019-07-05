const request = require('request');

const apiOptions = {
    server: 'http://localhost:3000'
};

if (process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://gentle-fortress-68805.herokuapp.com/';
}

const showError = (req, res, status) => {
    let title = '';
    let content = '';

    if (status === 404) {
        title = '404, page not found';
        content = 'Oh dear. Looks like you can\'t find this page. Sorry.';
    }
    else {
        title = `${status} something's gone wrong`;
        content = 'Something, somewhere, has gone just a little bit wrong.';
    }

    res.status(status);
    res.render('generic-text', {
        title,
        content
    });
};

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

const renderDetailPage = (req, res, location) => {
    res.render('location-info', {
        title: location.name,
        sidebarLead: 'Starcups is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
        sidebarSubtext: 'If you\'ve been here and you like it - or if you don\'t - please leave a review to help people just like you.',
        location
    });
}

const locationInfo = (req, res) => {
    const locationId = req.params.locationId;
    const path = `/api/locations/${locationId}`;
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {}
    };

    request(requestOptions, (err, response, body) => {
        if (response.statusCode !== 200) {
            showError(req, res, response.statusCode);
            return;
        }

        const data = body;

        data.coords = {
            lng: body.coords[0],
            lat: body.coords[1]
        };
        
        data.hours = data.openingTimes.map(ot => {
            if (ot.closed) {
                return `${ot.days} CLOSED`;
            }
            
            return `${ot.days} ${ot.opening} - ${ot.closing}`;
        });

        data.mapUri = 'https://maps.googleapis.com/maps/api/staticmap?center=51.455041,-0.9690884&zoom=17&size=400x350&sensor=false&markers=51.455041,-0.9690884&scale=2&key=AIzaSyCdUIbWu-0_w9uAEjbMQ4ABk7H_uQwu4vg&signature=bIBB8tGSIgwB0Liom_teLSUpShE=';

        renderDetailPage(req, res, data);
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
