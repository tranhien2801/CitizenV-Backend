const newsRouter = require('./news');
const meRouter = require('./me');
const coursesRouter = require('./courses');
const citizenRouter = require('./citizens');
const cityRouter = require('./city');
const siteRouter = require('./site');

function route(app) {
    app.use('/news', newsRouter);
    app.use('/citizens', citizenRouter);
    app.use('/city', cityRouter);
    app.use('/me', meRouter);
    app.use('/courses', coursesRouter);
    app.use('/', siteRouter);
}

module.exports = route;
