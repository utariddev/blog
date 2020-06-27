//https://stackoverflow.com/a/54689979/2646022

//PROD
let URL_HOST = "http://blogsrvr.herokuapp.com/rest/message/";

//TEST
// let URL_HOST = "http://localhost:8080/blogserver/rest/message/";

let URL_GET_CATEGORIES = "getCategories";
let URL_GET_ARTICLES = "getArticles";
let URL_GET_ARTICLE = "getArticle";
let URL_GET_MOST_READ_ARTICLE = "getMostReadArticles";
let URL_GET_CATEGORY_ARTICLES = "getCategoryArticles";
let URL_GET_ARTICLES_COUNT = "getArticlesCount";

module.exports = {
  URL_HOST,
  URL_GET_CATEGORIES,
  URL_GET_ARTICLES,
  URL_GET_ARTICLE,
  URL_GET_MOST_READ_ARTICLE,
  URL_GET_CATEGORY_ARTICLES,
  URL_GET_ARTICLES_COUNT
}
