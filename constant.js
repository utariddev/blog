//https://stackoverflow.com/a/54689979/2646022

//PROD
const URL_HOST = process.env.URL_HOST;
const URL_HOST_LUGAT = process.env.URL_HOST_LUGAT;

//TEST
// const URL_HOST = "http://localhost:8080/blogserver/rest/message/";

const URL_GET_CATEGORIES = "getCategories";
const URL_GET_ARTICLES = "getArticles";
const URL_GET_ARTICLE = "getArticle";
const URL_GET_MOST_READ_ARTICLE = "getMostReadArticles";
const URL_GET_CATEGORY_ARTICLES = "getCategoryArticles";
const URL_GET_ARTICLES_COUNT = "getArticlesCount";
const URL_GET_LUGAT_WORD = "word";

module.exports = {
  URL_HOST_LUGAT,
  URL_GET_LUGAT_WORD,
  URL_HOST,
  URL_GET_CATEGORIES,
  URL_GET_ARTICLES,
  URL_GET_ARTICLE,
  URL_GET_MOST_READ_ARTICLE,
  URL_GET_CATEGORY_ARTICLES,
  URL_GET_ARTICLES_COUNT
}
