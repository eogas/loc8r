
const homelist = (req, res) => {
    res.render('locations-list', {
        title: 'Loc8r - find a place to work with wifi',
        sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about.',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        locations: [{
            name: 'Starcups',
            address: '125 High Street, Reading RG6 1PS',
            rating: 3,
            facilities:[
                'Hot Drinks',
                'Food',
                'Premium wifi'
            ],
            distance: '100m'
        }, {
            name: 'Cafe Hero',
            address: '125 High Street, Reading RG6 1PS',
            rating: 4,
            facilities:[
                'Hot Drinks',
                'Food',
                'Premium wifi'
            ],
            distance: '200m'
        }, {
            name: 'Burger Queen',
            address: '125 High Street, Reading RG6 1PS',
            rating: 2,
            facilities:[
                'Food',
                'Premium wifi'
            ],
            distance: '250m'
        }]
    });
};

const locationInfo = (req, res) => {
    res.render('location-info', {
        title: 'Location info'
    });
};

const addReview = (req, res) => {
    res.render('location-review-form', { title: 'Add review' });
};

module.exports = {
    homelist,
    locationInfo,
    addReview
};
