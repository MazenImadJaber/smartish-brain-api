const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const { json } = require('express');
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: '',
        password: '',
        database: 'smart-brain'
    }
});

const app = express();

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
    bcrypt.hash(password, null, null, function (err, hash) {
        // STORE HASH IN DB
        console.log(hash)
    });
    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
        }).then(user => {
            res.json(user[0])
        })
        .catch(err => {
            res.status(400).json('unable to registor');
        })

})
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*')
        .from('users')
        .where({ id })
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('user not found')
            }

        })
        .catch(err => {
            res.status(400).json('error gettimg user')
        })

})
app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id','=',id)
    .increment('entries',1)
    .returning('entries')
    .then(entries =>{
        res.json(entries[0].entries)
    })
    .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, () => {
    console.log('app is listening on port 3000.....');
})


