# API GATEWAY

## Installation
1. Create ***.npmrc*** file at root folder

```
@huyleminh:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=<add your github token here>
```

2. Create ***.env*** file at root folder
- Copy content from ***.env.template***
- Modify variables:
    - If you catch this `# do not modify this variable`, so please keep its value

3. Intall packages: `npm install`

## Run
1. Run on your computer
- Start: `npm start`
- Start in watch mode: `npm run start:dev`

2. Run with docker
- Create ***.env.production*** file at root folder
- Copy content from ***.env***
- Create docker network:
```bash
docker create network local_network
```
- Start:
```bash
docker compose up -d
```