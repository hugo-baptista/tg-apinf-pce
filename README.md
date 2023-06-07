# Trabalho de Grupo de Aplicações Informáticas e Processo Clínico Eletrónico

### Autores:
```
A87240 Ciarán John Tavares McEvoy
PG50392 Gonçalo Afonso de Carvalho
PG50416 Hugo Baptista Fernandes Silva
PG50788 Tomás Alves Lima
```

Como as pastas node_modulesdo frontend e do backend são muito pesadas, elas não são guardadas no repositório git, pelo que é necessário realizar o seguinte comando para os dois (frontend e backend):
```
npm install --legacy-peer-deps
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
### Dependências:
A pasta das depenências (node_modules) do Frontend não é colocada no GitHub por ser muito pesada, pelo que é necessário correr o seguinte código para as baixar:
```
> npm install
```
## Base de Dados - Mongo
### Criar Base de Dados:
```
> ???
```