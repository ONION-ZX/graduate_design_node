const express = require('express');
const dbUtil = require('../db/dbUtil');
const router = express.Router();

router.get('/createUser', (req, res, next) => {
  let userName = req.query.username;
  let passWord = req.query.password;
  if (!userName && !passWord) {
    res.json({
      error: 'Invalid arguments'
    });
    return;
  }

  dbUtil.createUser(userName, passWord).then((result) => {
    res.json({
      username: userName,
      password: passWord,
      id: result.insertId
    });
  }).catch((error) => {
    res.statusCode = 500;
    res.json({
      error: error.sqlMessage
    });
  });
});

router.get('/getUser', (req, res, next) => {
  let userId = req.query.id;
  let limit = req.query.limit;

  dbUtil.queryUser(userId, limit).then((results) => {
    res.json(results);
  }).catch((error) => {
    res.statusCode = 500;
    res.json(error);
  });
});

router.get('/editUser', (req, res, next) => {
  let userId = req.query.id;
  let password = req.query.password;
  let avatarUrl = req.query.avatar_url;

  if (!userId || (userId && (!password && !avatarUrl))) {
    res.statusCode = 404;
    res.json({
      error: 'Invalid arguments'
    });
    return;
  }

  dbUtil.queryUser(userId).then((results) => {
    if (results.length == 0) {
      res.statusCode = 404;
      res.json({
        error: 'User does not exist'
      });
      return;
    }

    dbUtil.editUser(userId, password, avatarUrl)
      .then((result) => {
        res.json({
          msg: 'Modify the success'
        });
      }).catch((error) => {
        res.statusCode = 500;
        res.json(error);
      });


  }).catch((error) => {
    res.statusCode = 500;
    res.json(error);
  });
});

module.exports = router;