# Краткая инструкция по поднятию

- [Ставим ноду](https://nodejs.org/en/download/package-manager/)
- [Ставим монгу](https://docs.mongodb.com/manual/installation/)
- Запускаем демона монга `service mongod start # или mongodb`
- Запускаем шелл монги `mongo`
- Добавляем админа
  ```
  use admin;

  db.createUser(
  { user: "admin", pwd: "<пароль админа>", roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] }
  )

  ```
- Добавляем юзера для своей базы
  ```
  use admin;
  db.auth("admin", "<пароль>")

  use radio;
  db.createUser(
  { user: "radio", pwd: "<пароль от базы радио>", roles: [ "readWrite" ] }
  )
  db.auth("radio", "<пароль>") // проверяем работает ли
  exit // выходим
  ```
- `npm i` в папке склонированного репозитория чтобы поставить зависимости
- В config.json прописываем базовую конфигурацию
  ```
  {
  "login": "<аккаунт радио>",
  "pass": "<пароль от него>",
  "port": <порт сайта>
  }
  ```
- Стартуем сервер `npm run start` и идём на `localhost:порт`