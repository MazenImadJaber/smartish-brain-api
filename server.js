const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const knex  = require('knex')
const postgres = knex({
    client: 'pg',
    connection:{
        host: '127.0.0.1',
        user: '',
        password: '',
        database: 'smart-brain'
    }
});
postgres.select('*').from('users')

const app = express();
const database = {
    users: [
        {
            id: '123',
            name: 'john',
            email: 'john@gmail.com',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '789',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}
app.use(express.json())
app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/signin', (req, res) => {

    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json('success')
    } else {
        res.status(400).json('error logging in')
    }
})
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    bcrypt.hash(password,null , null, function(err,hash){
        // STORE HASH IN DB
        console.log(hash)
    });
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1])
})
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            res.json(user);
            found = true;
        }
    });
    if (!found) {
        res.status(400).json('no such user');
    }

})
app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            res.json(user.entries);
        }
    });
    if (!found) {
        res.status(400).json('no such user');
    }
})

app.listen(3000, () => {
    console.log('app is listening on port 3000.....');
})


