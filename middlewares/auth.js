function checkAuthenticated(req, res, next) {
    // Passport method to verify if user is logged in
    if (req.isAuthenticated()) {
        return next();
    }

    // if not, you're redirected to the login area
    res.redirect('/login');
}

function checkAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin === true) {
        return next();
    }

    res.status(403).send('Access denied!');
}

module.exports = { checkAuthenticated, checkAdmin };