var express = require('express');
var router = express.Router();
var debug = require('debug')('blog:server');
var axios = require('axios');
const crypto = require('crypto');
const argon2 = require('argon2');
var constant = require('../constant');
debug.enabled = false;

/* GET home page. */
router.get('/', function (req, res, next) {
  Promise.all([
    fetchArticles(0),
    fetchCategories(),
    fetchMostReadArticles(),
    fetchArticlesCount()
  ]).then(([articlesData, categoriesData, mostReadData, articlesCountData]) => {
    res.render('index', {
      articles: articlesData.result.code == 1 ? articlesData.data : [],
      categories: categoriesData.result.code == 1 ? categoriesData.data : [],
      mostRead: mostReadData.result.code == 1 ? mostReadData.data : [],
      articleCount: articlesCountData.result.code == 1 ? articlesCountData.data.count : 0,
      pageCount: articlesCountData.result.code == 1 ? Math.ceil(articlesCountData.data.count / 3) : 1,
      formatDate: getFormattedDateTime
    });
  }).catch(error => {
    debug("SSR Error: " + error);
    res.render('index', { error: error });
  });
});

function getFormattedDateTime(datetime) {
  const months = ["ocak", "şubat", "mart", "nisan", "mayıs", "haziran", "temmuz", "ağustos", "eylül", "ekim", "kasım", "aralık"]; // tr
  let current_datetime = new Date(datetime);
  return months[current_datetime.getMonth()] + " " + current_datetime.getDate() + ", " + current_datetime.getFullYear();
}

function fetchArticles(indicator) {
  const reqAddress = constant.URL_HOST + constant.URL_GET_ARTICLES;
  const reqBody = { "indicator": indicator.toString() };
  return axios.post(reqAddress, reqBody).then(r => {
    debug("fetched articles: ", JSON.stringify(r.data).substring(0, 100)); // Log first 100 chars
    return r.data;
  });
}

function fetchCategories() {
  const reqAddress = constant.URL_HOST + constant.URL_GET_CATEGORIES;
  const reqBody = {};
  return axios.post(reqAddress, reqBody).then(r => {
    debug("fetched categories: ", JSON.stringify(r.data).substring(0, 100));
    return r.data;
  });
}

function fetchMostReadArticles() {
  const reqAddress = constant.URL_HOST + constant.URL_GET_MOST_READ_ARTICLE;
  const reqBody = {};
  return axios.post(reqAddress, reqBody).then(r => {
    debug("fetched most read: ", JSON.stringify(r.data).substring(0, 100));
    return r.data;
  });
}


function fetchArticlesCount() {
  const reqAddress = constant.URL_HOST + constant.URL_GET_ARTICLES_COUNT;
  const reqBody = {};
  return axios.post(reqAddress, reqBody).then(r => r.data);
}

router.get("/getArticle/:article_id", (req, res, next) => {
  getArticle(res, req, next)
});

router.get("/getArticles/:indicator", (req, res, next) => {
  getArticles(res, req, next)
});

router.get("/getCategories", (req, res, next) => {
  getCategories(res, req, next)
});

router.get("/getMostReadArticles", (req, res, next) => {
  getMostReadArticles(res, req, next)
});

router.get("/getCategoryArticles/:category_name", (req, res, next) => {
  getCategoryArticles(res, req, next)
});

router.get("/getArticlesCount", (req, res, next) => {
  getArticlesCount(res, req, next)
});

router.get("/removeGSAccount/:mail/:username", (req, res, next) => {
  removeGSAccount(res, req, next)
});

router.get("/removeAccount/:mail/:password", (req, res, next) => {
  removeAccount(res, req, next)
});

router.get("/removeAccount2/:username/:password", (req, res, next) => {
  removeAccount2(res, req, next)
});

function getArticle(res, req, next) {
  const reqAddress = constant.URL_HOST + constant.URL_GET_ARTICLE
  const reqBody = {
    "articleID": req.params.article_id.toString()
  }

  axios.post(reqAddress, reqBody)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      debug("getArticle error : " + error)

      const errorResponse = {
        "result": {
          "code": "99",
          "desc": error
        }
      }

      res.json(errorResponse);
    })
}

function getArticles(res, req, next) {
  debug("getArticles : " + req.params.indicator.toString())
  const reqAddress = constant.URL_HOST + constant.URL_GET_ARTICLES
  const reqBody = {
    "indicator": req.params.indicator.toString()
  }

  debug("getArticles url : " + reqAddress)

  axios.post(reqAddress, reqBody)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      debug("getArticles error : " + error)

      const errorResponse = {
        "result": {
          "code": "99",
          "desc": error
        }
      }

      res.json(errorResponse);
    })
}

function getCategories(res, req, next) {
  debug("getCategories")
  const reqAddress = constant.URL_HOST + constant.URL_GET_CATEGORIES
  const reqBody = {}

  debug("getCategories url : " + reqAddress)

  axios.post(reqAddress, reqBody)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      debug("getCategories error : " + error)

      const errorResponse = {
        "result": {
          "code": "99",
          "desc": error
        }
      }

      res.json(errorResponse);
    })
}

function getMostReadArticles(res, req, next) {
  debug("getMostReadArticles")
  const reqAddress = constant.URL_HOST + constant.URL_GET_MOST_READ_ARTICLE
  const reqBody = {}

  debug("getMostReadArticles url : " + reqAddress)

  axios.post(reqAddress, reqBody)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      debug("getMostReadArticles error : " + error)

      const errorResponse = {
        "result": {
          "code": "99",
          "desc": error
        }
      }

      res.json(errorResponse);
    })
}

function getCategoryArticles(res, req, next) {
  debug("getCategoryArticles")
  const reqAddress = constant.URL_HOST + constant.URL_GET_CATEGORY_ARTICLES
  const reqBody = {
    "categoryName": req.params.category_name.toString()
  }

  debug("getCategoryArticles url : " + reqAddress)

  axios.post(reqAddress, reqBody)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      debug("getCategoryArticles error : " + error)

      const errorResponse = {
        "result": {
          "code": "99",
          "desc": error
        }
      }

      res.json(errorResponse);
    })
}

function getArticlesCount(res, req, next) {
  debug("getArticlesCount")
  const reqAddress = constant.URL_HOST + constant.URL_GET_ARTICLES_COUNT
  const reqBody = {}

  debug("getArticlesCount url : " + reqAddress)

  axios.post(reqAddress, reqBody)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      debug("getArticlesCount error : " + error)

      const errorResponse = {
        "result": {
          "code": "99",
          "desc": error
        }
      }

      res.json(errorResponse);
    })
}

function removeGSAccount(res, req, next) {
  const reqAddress = constant.URL_HOST_FW + constant.URL_GET_FW_REMOVE_GS
  const encryptedMail = encryptAES(req.params.mail);

  const reqBody = {
    mail: encryptedMail,
    username: req.params.username,
  };

  axios.post(reqAddress, reqBody)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {

      const errorResponse = {
        "result": {
          "code": "99",
          "desc": error
        }
      }

      res.json(errorResponse);
    })
}

function removeAccount(res, req, next) {
  debug('removeAccounts');
  const reqAddress = constant.URL_HOST_FW + constant.URL_GET_FW_REMOVE
  const encryptedMail = encryptAES(req.params.mail);

  hashPassword(req.params.password)
    .then((hash) => {
      const reqBody = {
        mail: encryptedMail,
        password: hash,
      };

      axios.post(reqAddress, reqBody)
        .then(response => {
          res.json(response.data);
        })
        .catch(error => {

          const errorResponse = {
            "result": {
              "code": "99",
              "desc": error
            }
          }

          res.json(errorResponse);
        })
    })
    .catch((error) => {
    });
}

function removeAccount2(res, req, next) {
  debug('removeAccount2');
  const reqAddress = constant.URL_HOST_FW + constant.URL_GET_FW_REMOVE_2

  hashPassword(req.params.password)
    .then((hash) => {
      const reqBody = {
        username: req.params.username,
        password: hash,
      };

      axios.post(reqAddress, reqBody)
        .then(response => {
          res.json(response.data);
        })
        .catch(error => {
          const errorResponse = {
            "result": {
              "code": "99",
              "desc": error
            }
          }

          res.json(errorResponse);
        })
    })
    .catch((error) => {
    });
}

async function hashPassword(password) {
  const salt = constant.salt.split(',').map(Number);

  try {
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      hashLength: 32,
      timeCost: 8,
      parallelism: 4,
      memoryCost: 8192,
      salt: Buffer.from(salt, 'utf-8')
    });

    return hash;
  } catch (error) {
    debug('hash error:', error);
    throw error;
  }
}

function encryptAES(plainText) {
  const aesKey = Buffer.from(constant.aesKey.split(',').map(value => parseInt(value)));
  const iv = Buffer.from(constant.iv.split(',').map(value => parseInt(value)));

  const cipher = crypto.createCipheriv('aes-128-cbc', aesKey, iv);
  cipher.setAutoPadding(true);

  let encryptedText = cipher.update(plainText, 'utf8', 'hex');
  encryptedText += cipher.final('hex');

  return encryptedText;
}

module.exports = router;
