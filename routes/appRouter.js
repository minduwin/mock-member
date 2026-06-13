const Router = require('express');
const appRouter = Router();
const appController = require('../controller/appController');

appRouter.get('/', appController.homePage);

module.exports = appRouter;