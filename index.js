const express = require('express');
const redis = require('redis');
const fs = require('fs');

const PORT = 5000;
const REDIS_PORT = 6379;

const app = express();
const redisClient = redis.createClient(REDIS_PORT);
redisClient.on('error', err => console.log(err));
redisClient.connect().then(() => console.log('Redis Connected!'));

function redisCache(req, res, next) {
    const { name } = req.params;
    console.log(name, "redis");

    redisClient.get(name).then(data => {
        if(data !== null) {
            console.log(data, "redis data");
            res.status(200).send(data);
        } else {
            next();
        }
    });
}

function getRole(req, res) {
    try {
        const { name } = req.params;
        console.log(name, "server");
        let role;
        if(name) {
            fs.readFile("./data/trainees.json", "utf8", async (err, data) => {
                if(err) throw err;
                data = JSON.parse(data);
                if(data.length > 0) {
                    for(let i = 0; i < data.length; i++) {
                        if(data[i].name === name) {
                            role = data[i].role;
                            console.log(role);
                            redisClient.set(name, role).then(res => console.log(res, "redis set"));
                            // redisClient.setEx(name, 3600, role).then(res => console.log(res, "redis set"));
                            // redisClient.get(name).then(res => console.log(res, "redis get"));
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
app.get('/api/trainees/:name', redisCache, getRole);

app.listen(PORT, () => console.log(`Server is listening at ${PORT}`));