class UI {
  article_main = null;
  wait = null;
  loader_main = null;
  wait_loader_text = null;
  wait_loader_time = null;
  constructor() {
    consoleLog("ui constructor")
    this.article_main = $("#main");
    this.wait = $("#wait");
    this.loader_main = $("#wait_loader");
    this.wait_loader_text = $("#wait_loader_text");
    this.wait_loader_time = $("#wait_loader_time");
  }
}

class LoadingScreen {
  is_get_article_done = null;
  is_get_article_success = null;
  constructor() {
    this.is_get_article_done = false;
    this.is_get_article_success = false;
  }
}

var ui_elements = null;
var loading_screen = null;
var timer = new easytimer.Timer();

$(document).ready(function() {
  consoleLog("document ready");

  documentReady();
});

$(window).on("load", function() {
  consoleLog("windows load")
});

/*
  document ready durumunda yapilacaklar
*/
function documentReady() {
  let article_id = getArticleIDFromURL();
  createClass();
  showLoadingScreen();
  //article_id int olmali ve bos olmamali
  if (article_id != null && article_id != "" && !isNaN(article_id)) {
    getArticle(article_id);
  } else {
    hideLoadingAndShowError();
  }
}

/*
  url den article id yi alir
*/
function getArticleIDFromURL() {
  let url = window.location.href;
  let url_array = url.split("/");
  let article_id = url_array[url_array.length - 1];
  return article_id;
}

/*
  kullanilacak siniflar ilklendiriliyor
*/
function createClass() {
  if (ui_elements == null) {
    ui_elements = new UI();
  }
  if (loading_screen == null) {
    loading_screen = new LoadingScreen();
  }
}

/*
  sayaci gosterir
*/
function showTimer() {
  timer.start({
    precision: 'secondTenths'
  });
  timer.addEventListener('secondTenthsUpdated', function(e) {
    ui_elements.wait_loader_time.html(timer.getTimeValues().toString(['minutes', 'seconds', 'secondTenths']));
  });
}

/*
  yukleniyor ekranini gosterir
*/
function showLoadingScreen() {
  showTimer();
  ui_elements.wait_loader_text.text("yükleniyor");
  ui_elements.wait.removeClass("display_none");
  ui_elements.loader_main.addClass("custom_loader");
}

/*
  hata mesajni gosterir
*/
function hideLoadingAndShowError() {
  ui_elements.loader_main.removeClass("custom_loader");
  ui_elements.wait_loader_text.text("burada okunacak bir şey yok");
  timer.stop();
}

/*
  post requestler basarili ise yukleniyor ekranini kapatir. yoksa hata mesaji gosterir
*/
function hideLoadingScreen() {
  if (loading_screen.is_get_article_done) {
    if (loading_screen.is_get_article_success) {
      ui_elements.loader_main.removeClass("custom_loader");
      ui_elements.wait.addClass("display_none");
    } else {
      ui_elements.loader_main.removeClass("custom_loader");
      ui_elements.wait_loader_text.text("bir şey bozuk. bi ara tekrar dene");
    }
  }
  timer.stop();
}

/*
  getArticle post request
*/
function getArticle(article_id) {
  consoleLog("getArticle : " + article_id)

  $.ajax({
    url: '/getArticle/' + article_id,
    type: 'GET',
    dataType: 'json',
    success: (data) => {
      consoleLog("getArticle client response from server : ", data);

      loading_screen.is_get_article_success = true
      loading_screen.is_get_article_done = true;

      if (data.result.code == 1) {
        locateArticle(data.data[0]);
        hideLoadingScreen()
      } else {
        hideLoadingAndShowError()
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      loading_screen.is_get_article_success = false;
      loading_screen.is_get_article_done = true;

      consoleLog("getArticles error, XMLHttpRequest : ", XMLHttpRequest);
      consoleLog("getArticles error, textStatus : ", textStatus);
      consoleLog("getArticles error, errorThrown : ", errorThrown);

      hideLoadingScreen()
    }
  });
}

/*
  makale datasini html e yerlestirir
*/
function locateArticle(serverData) {
  ui_elements.article_main.append(`<article class="post">
                  <header>
                    <div class="title">
                      <h2><a href="#">` + serverData.article_title + `</a></h2>
                      <!--<p>Lorem ipsum dolor amet nullam consequat etiam feugiat</p>-->
                    </div>
                    <div class="meta">
                      <time class="published" datetime="` + serverData.article_date + `">` + getFormattedDateTime(serverData.article_date) + `</time>
                        <a href="#" class="author">
                          <span class="name">` + serverData.author_name + `</span>
                          <img src="../images/avatar.jpg" alt="" />
                        </a>
                    </div>
                  </header>
                  <span class="image featured">` + serverData.article_image + `</span>
                  ` + serverData.article_text + `
                  <br/><br/>
                  <footer>
                    <ul class="stats">
                      <li><a href="/category/` + serverData.blog_category_name + `">` + serverData.blog_category_name + `</a></li>
                      <li><a href="#" class="icon solid fa-book-open">` + serverData.article_read + `</a></li>
                      <!--<li><a href="#" class="icon solid fa-comment">128</a></li>-->
                    </ul>
                  </footer>
                </article>
    `)
}
