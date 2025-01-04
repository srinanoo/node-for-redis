const express = require('express');
const redis = require('redis');
const fs = require('fs');

const PORT = 5000;
const REDIS_PORT = 6379;

const app = express();
const redisClient = redis.createClient(REDIS_PORT);
redisClient.on('error', err => console.error(err));
redisClient.connect().then(() => console.log('Redis Connected!'));

function redisCache(req, res, next) {
    try {
        const { name } = req.params;
    
        redisClient.get(name, (err, data) => {
            if(err) throw err;
            console.log(data);
            if(data !== null) {
                res.status(200).send(data);
            } else {
                next();
            }
        })
    } catch (err) {
        res.status(500).send(err.message);
    }
}

function getRole(req, res, next) {
    try {
        const { name } = req.params;
        let role;
        if(name) {
            fs.readFile("./data/trainees.json", "utf8", (err, data) => {
                if(err) throw err;
                data = JSON.parse(data);
                if(data.length > 0) {
                    for(let i = 0; i < data.length; i++) {
                        if(data[i].name === name) {
                            role = data[i].role;
                            // redisClient.set(name, role);
                            redisClient.setEx(name, 3600, role);
                            break;
                        }
                    }
                }
                (role) ? res.status(200).send(role) : res.status(404).send("Trainee not found!");
            });
        } else res.status(404).send("Trainee not found!");
    } catch(err) {
        res.status(500).send(err.message);
    }
}
app.get('/api/trainees/:name', getRole);

app.listen(PORT, () => console.log(`Server is listening at ${PORT}`));