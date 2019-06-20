
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
