var express = require('express');
var constant = require('../constant');
var axios = require('axios');
var debug = require('debug')('blog:server');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('lugat', {});
});

router.get('/:word_name', (req, res, next) => {
  res.render('lugat', {
    word_name: req.params.word_name
  });
});

router.get("/getWord/:word_name", (req, res, next) => {
    getWord(res, req, next)
});

function getWord(res, req, next) {
    const reqAddress = constant.URL_HOST_LUGAT + constant.URL_GET_LUGAT_WORD + "/" + req.params.word_name.toString()
    axios.get(reqAddress)
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            debug("getWord error : " + error)
            const errorResponse = {
                "result": {
                    "code": "99",
                    "desc": error
                }
            }

            res.json(errorResponse);
        })
}

module.exports = router;
