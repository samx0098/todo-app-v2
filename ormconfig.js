require("dotenv").config({
    path: [`${__dirname}/.env.local`, `${__dirname}/.env`],
})

module.exports = {
    type: "mysql",
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DB,
    entities: ["src/**/*.entity{.ts,.js}"],
    seeds: ["src/seeds/**/*{.ts,.js}"],
    factories: ["src/factories/**/*{.ts,.js}"],
    synchronize: false,
}
