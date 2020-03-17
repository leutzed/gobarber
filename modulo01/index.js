const express = require('express');

const server = express();

server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request Body = { "name": "daniel", "email": "leutzed@gmail.com"}

const users = ['Diego', 'Robson', 'Victor'];

server.use((req, res, next) => {
    console.time('Request');
    console.log(`Método: ${req.method}; URL: ${req.url}`);

    next();

    console.timeEnd('Request');
});

//Middleware para ver se o campo 'nome' do user existe
function checkUserExists(req, res, next) {
    if(!req.body.name){
        return res.status(400).json( { error : 'User field name is required' });
    }
    
    return next();
}

//Middleware para ver se o user existe no array
function checkUserInArray(req, res, next){
    const user = users[req.params.index];

    if(!user){
        return res.status(400).json( { error : 'User does not exists ' });
    }

    req.user = user;
    
    return next();
}


server.get('/users', (req, res) => {
    return res.json(users);
});

server.get('/users/:index', checkUserInArray, (req, res) => {
    return res.json(req.user);
});

//Para gravar usuário
server.post('/users', checkUserExists, (req, res) => {
    const {name} = req.body;

    users.push(name);

    return res.json(name);
});

//Alterar usuário
server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
    const {index} = req.params;
    const {name} = req.body;

    users[index] = name;

    return res.json(users);
});

// Excluir User
server.delete('/users/:index', checkUserInArray, (req, res) => {
    const {index} = req.params;

    users.splice(index, 1);

    return res.send();
});


server.listen(3000);