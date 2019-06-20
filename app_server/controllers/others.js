
const about = (req, res) => {
    res.render('generic-text', {
        title: 'About',
        aboutText: 'Loc8r was created to help people find places to sit down and get a bit of work done\n\n' +
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ' +
            'ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco ' + 
            'laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in ' +
            'voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat ' + 
            'non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    });
};

module.exports = {
    about
};
