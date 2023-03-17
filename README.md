# Trabalho de Grupo de Aplicações Informáticas e Processo Clínico Eletrónico

### Autores:
```
A87240 Ciarán John Tavares McEvoy
PG50392 Gonçalo Afonso de Carvalho
PG50416 Hugo Baptista Fernandes Silva
PG50788 Tomás Alves Lima
```

# Estrutura do Trabalho
## Backend - NodeJS - Porta 8080
### Criar o Backend:
```
> express --no-view backend
> cd backend
> npm install
```
### Alterar porta:

No ficheiro ./backend/bin/www, alterar:
```
var port = normalizePort(process.env.PORT || '3000');
```
Para:
```
var port = normalizePort(process.env.PORT || '8080');
```
## Frontend - React - Porta 3000
### Criar o Frontend:
```
> npx create-react-app frontend
```
## Base de Dados - Mongo
### Criar Base de Dados:
```
> ???
```