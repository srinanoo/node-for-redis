Redis Caching in Node/Express

- Node Redis Documentation - https://redis.js.org/

- Install Redis in OS
    - Windows - not supported, need to use WSL2 in Windows
	    - https://docs.microsoft.com/en-us/windows/wsl/install
    - Install through WSL2
        - in bash
            - sudo apt-get install lsb-release curl gpg
            - curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
            - sudo chmod 644 /usr/share/keyrings/redis-archive-keyring.gpg
            - echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
            - sudo apt-get update
            - sudo apt-get install redis
        - restart the system
        - if redis not started:
            - sudo systemctl enable redis-server
            - sudo systemctl start redis-server

            or

            - sudo service redis-server start
            - sudo service redis-server stop
            - sudo service redis-server restart
            - sudo service redis-server stop

- Setup Node/Express and Redis
    - npm init -y
    - npm i express redis