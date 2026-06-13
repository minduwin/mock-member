const Router = require('express');
const appRouter = Router();
const appController = require('../controller/appController');
const passport = require('../config/passport');

const { checkAuthenticated, checkAdmin } = require('../middlewares/auth');

appRouter.get('/', appController.homePage);
appRouter.get('/register', appController.register);
appRouter.get('/login', appController.login);
appRouter.get('/message', appController.message);
appRouter.get('/logout', appController.loggingOut);
appRouter.get('/membership', checkAuthenticated, appController.member);
appRouter.get('/beAdmin', checkAuthenticated, appController.beAdmin);

appRouter.post('/register', appController.newUser);
appRouter.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/',
        failureMessage: true
    })
);

// middleware will check authentication before pass to the post message
// and process membership/administration
appRouter.post('/message', checkAuthenticated, appController.postMessage);
appRouter.post('/membership', checkAuthenticated, appController.processMembership);
appRouter.post('/beAdmin', checkAuthenticated, appController.processAdmin);

appRouter.post('/:id/delete', checkAdmin, appController.deletePost);

module.exports = appRouter;