const citizenRouter = require('./citizens');
const unitRouter = require('./unit');
const homeRouter = require('./home');
const loginRouter = require('./login');
const searchRouter = require('./search');
const countRouter = require('./count');
const declareRouter = require('./declare');


function route(app) {
    app.use('/declare', declareRouter);
    app.use('/statistic', countRouter);
    app.use('/search', searchRouter);
    app.use('/units', unitRouter);
    app.use('/citizens', citizenRouter);
    app.use('/', loginRouter);
}

module.exports = route;
