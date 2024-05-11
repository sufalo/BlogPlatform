const express = require('express');
const app = express();
const path = require('path');
const knex = require('knex')(require('./knexfile').development);
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.theme = req.cookies.theme || 'light-mode';
    next();
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(async (req, res, next) => {
    if (req.session && req.session.userId) {
        req.user = await knex('users').where({ id: req.session.userId }).first();
    } else {
        req.user = null;
    }
    next();
});

app.get('/', async (req, res) => {
    const posts = await knex('posts').select('*');
    res.render('index', { posts, user: req.user });
});

app.get('/post/:id', async (req, res) => {
    const postId = req.params.id;
    const post = await knex('posts').where({ id: postId }).first();

    const comments = await knex('comments').where({ post_id: postId }).orderBy('created_at', 'asc');

    res.render('post', { post, comments, user: req.user });
});

app.get('/login', async(req,res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    const user = await knex('users').where({ username }).first();
    if (!user) {
        return res.status(400).send('Nieprawidłowa nazwa użytkownika lub hasło');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).send('Nieprawidłowa nazwa użytkownika lub hasło');
    }

    req.session.userId = user.id;
    res.redirect('/');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await knex('users').where({ username }).first();
    if (existingUser) {
        return res.status(400).send('Nazwa użytkownika już istnieje');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await knex('users').insert({
        username,
        password: hashedPassword
    });

    res.redirect('/login');
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Nie można wylogować użytkownika');
        }
        res.redirect('/');
    });
});

app.get('/posts/new', (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }

    res.render('create_post');
});

app.post('/posts', async (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }

    const { title, snippet, content } = req.body;

    await knex('posts').insert({
        title,
        snippet,
        content,
        author: req.user.username,
        date: new Date(),
        time: new Date()
    });

    res.redirect('/');
});

app.post('/posts/:id', async (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }

    const { title, snippet, content } = req.body;

    const postId = req.params.id;
    const post = await knex('posts').where({ id: postId }).first();

    if (!post || post.author !== req.user.username) {
        return res.status(403).send('Nie masz uprawnień do edycji tego posta');
    }

    await knex('posts').where({ id: postId }).update({
        title,
        snippet,
        content
    });

    res.redirect('/');
});

app.get('/posts/:id/edit', async (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }

    const post = await knex('posts').where({ id: req.params.id }).first();

    if (!post || post.author !== req.user.username) {
        return res.status(403).send('Nie masz uprawnień do edycji tego posta');
    }

    res.render('edit_post', { post });
});

app.post('/posts/:id/comments', async (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }

    const postId = req.params.id;

    const { content } = req.body;

    await knex('comments').insert({
        post_id: postId,
        author: req.user.username,
        content,
        created_at: new Date()
    });

    res.redirect(`/post/${postId}`);
});

app.post('/set-theme', (req, res) => {
    const { theme } = req.body;
    if (theme === 'light-mode' || theme === 'dark-mode') {
        res.cookie('theme', theme, { path: '/', maxAge: 86400000 });
    }
    res.redirect(req.get('referer') || '/');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Aplikacja działa na porcie ${port}`);
});
