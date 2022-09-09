<h1 align="center">
  Hacker News Analyzer
</h1>

## :arrow_forward: Starting the app

If you already have app running make sure to remove all containers with:

```
docker-compose down --rmi all -v --remove-orphans
```

After removing containers, build the app:

```
docker-compose build
```

Start memgraph, firebase service and backend:

```
docker-compose -d memgraph-mage
docker-compose -d firebase
docker-compose backend
```

Finally start frontend:
```
docker-compose -d frontend
```