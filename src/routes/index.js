const citizenRouter = require('./citizens');
const unitRouter = require('./unit');

function route(app) {
    app.use('/units', unitRouter);
    app.use('/citizens', citizenRouter);
}

module.exports = route;
