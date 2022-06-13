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
 db.select('*').from('users').then(data => res.json(data))
   
})

app.post('/signin', (req, res) => {
db.select('email','hash').from('login')
.where('email','=',req.body.email)
.then(data =>{
   const isValid = bcrypt.compareSync(req.body.password,data[0].hash)
   if(isValid){
    db.select('*').from('users')
    .where('email','=', req.body.email)
    .then(user=>{
        res.json(user[0])
    })
    .catch(err =>{
        res.status(400).json('unable to get user')
    })
   }else{
   res.status(400).json('wrong password')
   }
})
.catch(err => res.status(400).json('wrong password'))
})
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx
            .insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    }).then(user => {
                        res.json(user[0])
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
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
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries)
        })
        .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, () => {
    console.log('app is listening on port 3000.....');
})


