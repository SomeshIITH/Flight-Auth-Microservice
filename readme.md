### AuthService

- `npm init` then install required packages `npm i express body-parser dotenv nodemon mysql2 sequelize sequelize-cli bcrypt jsonwebtoken`

- Make src,.env , .gitignore, readme and start working

- `npx sequelize init` , then `npx sequelize  db:create` to create `Auth_DB_DEV` db

- to create User Model do `npx sequelize model:generate --name User --attributes email:String,password:String` , put validation of email and password in User model and migrate file , see documnetation of sequelize , and then migrate it by `npx sequelize db:migrate`

- create all api logic in src folder , error handling done by ServiceError, AppError, ValidationError`nmes - name ,message, explaination, statusCode`

- but issue is when user created/sign in its password is not encryted , so encrypt it in model layer because db has triggers so encrypt it beforeCreate with help of bcrypt package'

- handle signin and signup and use JWT token for connection , `npm i jsonwebtoken` , lot of authentication mechanism send jwt token in header

- make Role model by `npx sequelize model:generate --name Role --attributes name:string` , make many to many relationships between Roles and Users table , and this is done through  3rd table called through table `(UserRole)` , and do `npx sequelize db:migrate` and make ds sync in server to create table , `npx sequelize seed:generate --name add-roles` to generate seed values for role `npx sequelize db:seed:all` 

- now make isAdminAPI
- now handle error gracefully either by make our class as done in FlightandSearch or use `npm i http-status-codes` and then make error-handler in utils
 
