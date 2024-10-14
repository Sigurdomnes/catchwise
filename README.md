## CatchWise ESG-App

### Lokalt utviklingsmiljø:

Bygge koden: 
```bash
(root) % npm run build
```

Sett opp lokalt (med Docker Desktop):

```bash
(root) % docker-compose up --build -d
```

Dette starter:
1. Nginx-server med app eksponert på [localhost](http://localhost)
2. MongoDB-server på [localhost:27017](http://localhost:27017)


For hot-reload av next med db:

```bash
(root) % docker-compose up mongodb
(root) % npm run dev
```