## CatchWise ESG-App

### Local development:

Build: 
```bash
(root) % npm run build
```

Set up locally (with Docker Desktop):

```bash
(root) % docker-compose up --build -d
```

This starts:
1. Nginx-server with app exposed on [localhost:80](http://localhost:80)
2. MongoDB-server on [localhost:27017](http://localhost:27017)
