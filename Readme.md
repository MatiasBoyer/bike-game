# docker-compose
```
docker compose up --build -d
```

# Individual backend/frontend running using DOCKER
## BACKEND
Run backend
```
cd ./backend
```
```
docker build -t bikeback .
```
```
docker container run -d --rm --name bikeback -p 5010:3000 bikeback
```

## FRONTEND
Run frontend
```
cd ./frontend
```
```
docker build -t bikefront .
```
```
docker container run -d --rm --name bikefront -p 5011:4000 bikefront
```