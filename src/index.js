const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const session = require('express-session');
const hbs = handlebars.create({
    extname: 'hbs',
    helpers: {
        sum: (a, b) => a + b,
        sortable: (field, sort) => {
            const sortType = field === sort.column ? sort.type : 'default';

            const icons = {
                default: 'fas fa-sort',
                asc: 'fas fa-sort-amount-up',
                desc: 'fas fa-sort-amount-down',
            };
            const types = {
                default: 'desc',
                asc: 'desc',
                desc: 'asc',
            };

            const icon = icons[sortType];
            const type = types[sortType];

            return `<a href="/citizens?_sort&column=${field}&type=${type}">
                        <span class="${icon}"></span>
                    </a>`;
        },
    },
});

const SortMiddleware = require('./app/middleware/SortMiddleware');

const route = require('./routes');
const db = require('./config/db');

//Connect to DB
db.connect();

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

app.use(methodOverride('_method'));

// Custom middlewares
app.use(SortMiddleware);

// Http logger
// app.use(morgan('combined'));

// TEMPLATE ENGINE
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'UETcitizenV', 
    cookie: { maxAge: 5 * 3600 * 1000 }}));

// Routes init
route(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
