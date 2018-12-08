const fs = require('fs');
const mysql = require('mysql');

let defaultDatabaseName = "onion";
let configFilePath = `${__dirname}/dbConfig.json`;
if (!fs.existsSync(configFilePath)) {
    fs.writeFileSync(configFilePath, `{
        "host": "localhost",
        "user": "root",
        "password": "",
        "database": "",
        "connectionLimit": 10
    }`);
}

let string = fs.readFileSync(configFilePath);
let config = JSON.parse(string);
let connection = mysql.createConnection(config);

const createUsersTable = `CREATE TABLE IF NOT EXISTS Users
(
    id int PRIMARY KEY AUTO_INCREMENT,
    username varchar(32) NOT NULL unique,
    password varchar(16) NOT NULL,
    avatar_url varchar(128)
);`;

const createVehicleTable = `CREATE TABLE IF NOT EXISTS Vehicle
(
    id int PRIMARY KEY AUTO_INCREMENT,
    price float NOT NULL,
    title varchar(100) NOT NULL,
    year varchar(20) NOT NULL,
    preview json NOT NULL,
    brand_id integer NOT NULL,
    design_id integer NOT NULL,
    publisher_id integer NOT NULL,
    on_sale boolean NOT NULL,
    description varchar(128)
);`;

const createBrandTable = `CREATE TABLE IF NOT EXISTS Brand
(
    id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(100) NOT NULL
);`;

const createDesignTable = `CREATE TABLE IF NOT EXISTS Design
(
    id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(100) NOT NULL
);`;

const createIndentTable = `CREATE TABLE IF NOT EXISTS Indent
(
    id int PRIMARY KEY AUTO_INCREMENT,
    vehicle_id integer NOT NULL,
    seller_id integer NOT NULL,
    buyer_id integer,
    appointment_time date,
    memo varchar(200)
);`;

function initDB() {
    const createDatabase = `create database if not exists ${defaultDatabaseName};`;
    execute(createDatabase).then(() => {
        if (!config.database || config.database == "") {
            config.database = defaultDatabaseName;
            connection = mysql.createConnection(config);
        }
        console.log("init database successfully!");
        let tablesSqls = [createUsersTable, createVehicleTable,
            createBrandTable, createDesignTable,
            createIndentTable
        ];
        tablesSqls.forEach((sql) => {
            execute(sql).then((results) => {
                console.log("init table successfully!");
            }).catch((error) => {
                if (error.errno == 1050) {
                    console.warn('table already exists!');
                    return;
                }
                console.error(error);
            });
        });
    })
}

function execute(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (error, results, fields) {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

function queryUser(id = null, limit = null) {
    return new Promise((resolve, reject) => {
        let sql = `select id, username, password, avatar_url from Users;`;
        if (id && limit) {
            sql = `select id, username, password, avatar_url from Users where id='${id}' limit ${limit};`;
        } else if (id && limit == null) {
            sql = `select id, username, password, avatar_url from Users where id='${id}';`;
        }
        execute(sql).then((results) => {
            if (results) {
                resolve(results);
                return;
            }
            reject({
                error: 'no results'
            });
        }).catch((error) => {
            reject(error);
        });
    });
}

function createUser(userName, passWord) {
    return new Promise((resolve, reject) => {
        let sql = `insert into Users (username, password) values ('${userName}', '${passWord}');`;
        if (userName && passWord) {
            execute(sql).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            });
        } else {
            reject({
                error: 'Invalid arguments'
            });
        }

    });
}

function editUser(id, passWord = null, avatarUrl = null) {
    return new Promise((resolve, reject) => {
        let sql = null;
        if (passWord && avatarUrl) {
            sql = `update Users set password='${passWord}', avatar_url='${avatarUrl}' where id='${id}';`;
        } else if (avatarUrl && passWord == null) {
            sql = `update Users set avatar_url='${avatarUrl}' where id='${id}';`;
        } else {
            sql = `update Users set password='${passWord}' where id='${id}';`;
        }
        execute(sql).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
}


module.exports = {
    initDB: initDB,
    execute: execute,
    createUser: createUser,
    queryUser: queryUser,
    editUser: editUser
};