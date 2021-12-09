const citizenRouter = require('./citizens');
const unitRouter = require('./unit');
const homeRouter = require('./home');


function route(app) {
    app.use('/units', unitRouter);
    app.use('/citizens', citizenRouter);
    app.use('/', homeRouter);
}

module.exports = route;
