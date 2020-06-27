class UI {
  articles_main = null;
  wait = null;
  loader_main = null;
  body = null;
  wait_loader_text = null;
  wait_loader_time = null;
  // loader_ul_categories = null;
  ul_categories = null;
  div_most_read_articles = null;
  sidebar = null;
  intro = null;
  constructor() {
    consoleLog("ui constructor")
    this.articles_main = $("#main");
    this.wait = $("#wait");
    this.loader_main = $("#wait_loader");
    this.body = $("body");
    this.wait_loader_text = $("#wait_loader_text");
    this.wait_loader_time = $("#wait_loader_time .values");
    // this.loader_ul_categories = $("#loader_ul_categories");
    this.ul_categories = $("#ul_categories");
    this.div_most_read_articles = $("#div_most_read_articles");
    this.sidebar = $('#sidebar');
    this.intro = $('#intro');
  }
}

class LoadingScreen {
  is_get_categories_done = null;
  is_get_most_read_articles_done = null;
  is_get_articles_done = null;
  is_get_articles_count_done = null;
  is_get_categories_success = null;
  is_get_most_read_articles_success = null;
  is_get_articles_success = null;
  is_get_articles_count_success = null;
  constructor() {
    this.is_get_categories_done = false;
    this.is_get_most_read_articles_done = false;
    this.is_get_articles_done = false;
    this.is_get_articles_count_done = false;
    this.is_get_categories_success = false;
    this.is_get_most_read_articles_success = false;
    this.is_get_articles_success = false;
    this.is_get_articles_count_success = false;
  }
}

var ui_elements = null;
var loading_screen = null;
const articleCountPerPage = 3;
var pageCount = 1; //toplam sayfa sayisi
var currentPageNumber = 1; //acik olan sayfa numarasi
var timer = new easytimer.Timer();

$(document).ready(function() {
  consoleLog("document ready");
  createClass();

  showLoadingScreen();

  getArticlesCount();
  getCategories();
  getArticles(currentPageNumber);
  getMostReadArticles();
});

$(window).on("load", function() {
  consoleLog("windows load")
});

/*
  siniflari doldurur
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
  yukleniyor ekranini gosterir
*/
function showLoadingScreen() {
  showTimer();
  ui_elements.wait_loader_text.text("yükleniyor");
  ui_elements.wait.removeClass("display_none");
  ui_elements.loader_main.addClass("custom_loader");
}

/*
  post requestler basarili ise yukleniyor ekranini kapatir. yoksa hata mesaji gosterir
*/
function hideLoadingScreen() {
  if (loading_screen.is_get_categories_done &&
    loading_screen.is_get_most_read_articles_done &&
    loading_screen.is_get_articles_done &&
    loading_screen.is_get_articles_count_done) {
    if (loading_screen.is_get_categories_success &&
      loading_screen.is_get_most_read_articles_success &&
      loading_screen.is_get_articles_success &&
      loading_screen.is_get_articles_count_success) {
      ui_elements.loader_main.removeClass("custom_loader");
      ui_elements.wait.addClass("display_none");
      locateArticlesPageNumbers();
    } else {
      ui_elements.loader_main.removeClass("custom_loader");
      ui_elements.wait_loader_text.text("bir şey bozuk. bi ara tekrar dene");
    }
    fixIntroSection();
  }
  timer.stop();
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
  uygulama acildiginda logonun yer aldigi kisim ajax tarafindan eziliyor.
  ajax bittikten sonra tekrar duzenleniyor
*/
function fixIntroSection() {
  breakpoints.on('<=large', function() {
    ui_elements.intro.prependTo(ui_elements.articles_main);
  });

  breakpoints.on('>large', function() {
    ui_elements.intro.prependTo(ui_elements.sidebar);
  });
}

/*
  sayfa sayilarini ekler
*/
function locateArticlesPageNumbers() {
  var next_button = $("#next_button");
  for (var i = 0; i < pageCount; i++) {
    next_button.before(`<li><a id="page_` + parseInt(i + 1) + `" onClick="nextPageClicked(` + parseInt(i + 1) + `)" class="pagination button large previous">` + parseInt(i + 1) + `</a></li>`)
  }

  $(`#page_` + parseInt(currentPageNumber) + ``).addClass("on_page"); //aktif sayfaya css rule ekleniyor
}

/*
  getMostReadArticles post requestini gonderir
*/
function getMostReadArticles() {
  $.ajax({
    url: '/getMostReadArticles',
    type: 'GET',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    success: (data) => {
      consoleLog("getMostReadArticles success, data from server : ", data);

      loading_screen.is_get_most_read_articles_done = true;

      if (data.result.code == 1) {
        loading_screen.is_get_most_read_articles_success = true
        locateMostReadArticles(data.data);
      } else {
        loading_screen.is_get_most_read_articles_success = false;
      }
      hideLoadingScreen()
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      loading_screen.is_get_most_read_articles_success = false
      loading_screen.is_get_most_read_articles_done = true;

      consoleLog("getMostReadArticles error, XMLHttpRequest : ", XMLHttpRequest);
      consoleLog("getMostReadArticles error, textStatus : ", textStatus);
      consoleLog("getMostReadArticles error, errorThrown : ", errorThrown);

      hideLoadingScreen()
    }
  });
}

/*
  getArticlesCount post requestini gonderir
*/
function getArticlesCount() {
  $.ajax({
    url: '/getArticlesCount',
    type: 'GET',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    success: (data) => {
      consoleLog("getArticlesCount success, data from server : ", data);

      loading_screen.is_get_articles_count_done = true;

      if (data.result.code == 1) {
        loading_screen.is_get_articles_count_success = true
        let articles_count = data.data.count;
        pageCount = articles_count / articleCountPerPage //her sayfada 3 makale olsun
        pageCount = Math.ceil(pageCount)
        consoleLog("getArticlesCount pageCount : ", pageCount);
      } else {
        loading_screen.is_get_articles_count_success = false;
      }
      hideLoadingScreen();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      loading_screen.is_get_articles_count_success = false;
      loading_screen.is_get_articles_count_done = true;

      consoleLog("getArticlesCount error, XMLHttpRequest : ", XMLHttpRequest);
      consoleLog("getArticlesCount error, textStatus : ", textStatus);
      consoleLog("getArticlesCount error, errorThrown : ", errorThrown);

      hideLoadingScreen()
    }
  });
}

/*
  getArticles post requestini gonderir
*/
function getArticles(currPageNumber) {
  consoleLog("getArticles currPageNumber : " + currPageNumber)

  let indicator = (currPageNumber - 1) * articleCountPerPage;
  consoleLog("getArticles indicator : " + indicator)

  $.ajax({
    url: '/getArticles/' + indicator,
    type: 'GET',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    success: (data) => {
      consoleLog("getArticles success, data from server : ", data);

      loading_screen.is_get_articles_done = true;

      if (data.result.code == 1) {
        loading_screen.is_get_articles_success = true
        locateArticles(data.data, currPageNumber);
      } else {
        loading_screen.is_get_articles_success = false;
      }
      hideLoadingScreen();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      loading_screen.is_get_articles_success = false;
      loading_screen.is_get_articles_done = true;

      consoleLog("getArticles error, XMLHttpRequest : ", XMLHttpRequest);
      consoleLog("getArticles error, textStatus : ", textStatus);
      consoleLog("getArticles error, errorThrown : ", errorThrown);

      hideLoadingScreen()
    }
  });
}

/*
  getCategories post requestini gonderir
*/
function getCategories() {
  consoleLog("getCategories");

  // ui_elements.loader_ul_categories.addClass("custom_loader");

  $.ajax({
    url: '/getCategories',
    type: 'GET',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    success: (data) => {
      consoleLog("getCategories success, data from server : ", data);

      // ui_elements.loader_ul_categories.removeClass("custom_loader");
      ui_elements.ul_categories.removeClass("ul_categories")

      loading_screen.is_get_categories_done = true;

      if (data.result.code == 1) {
        loading_screen.is_get_categories_success = true
        locateCategories(data.data);
      } else {
        loading_screen.is_get_categories_success = false;
      }
      hideLoadingScreen();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {

      loading_screen.is_get_categories_success = false;
      loading_screen.is_get_categories_done = true;

      consoleLog("getCategories error, XMLHttpRequest : ", XMLHttpRequest);
      consoleLog("getCategories error, textStatus : ", textStatus);
      consoleLog("getCategories error, errorThrown : ", errorThrown);

      hideLoadingScreen()
    }
  });
}

/*
  bir sonraki sayfa butonu post requestini gonderir
*/
function nextPageClicked(currPageNumber) {

  consoleLog("nextPageClicked : ", currPageNumber);
  currentPageNumber = currPageNumber; //hideLoadingScreen() da kullanabilmek icin global degiskeni guncelliyorum
  loading_screen.is_get_articles_done = false;
  loading_screen.is_get_articles_success = false;
  showLoadingScreen();
  getArticles(currPageNumber);
}

/*
  son makaleleri ekrana yerlestirir
*/
function locateArticles(serverData, currPageNumber) {
  consoleLog("locateArticles : ", currPageNumber);

  //onceki datalari siliyor
  ui_elements.articles_main.empty();

  //son makaleler ekleniyor
  for (var i = 0; i < serverData.length; i++) {
    var data = serverData[i];
    ui_elements.articles_main.append(`<article class="post">
  				<header>
  					<div class="title">
  						<h2><a href="/single/` + data.id + `">` + data.article_title + `</a></h2>
  						<!--<p>` + data.article_summary + `</p>-->
  					</div>
  					<div class="meta">
  						<time class="published" datetime="` + data.article_date + `">` + getFormattedDateTime(data.article_date, false) + `</time>
  						<a href="#" class="author"><span class="name">` + data.author_name + `</span><img src="images/avatar.jpg" alt="" /></a>
  					</div>
  				</header>
  				<a href="single/` + data.id + `" class="image featured"><img src="images/` + data.article_image + `" alt="" /></a>
  				<p>` + data.article_summary + `</p>
  				<footer>
  					<ul class="actions">
  						<li><a href="single/` + data.id + `" class="button large">devam</a></li>
  					</ul>
  					<ul class="stats">
  						<li><a href="/category/` + data.blog_category_name + `">` + data.blog_category_name + `</a></li>
  						<li><a href="#" class="icon solid fa-book-open">` + data.article_read + `</a></li>
  						<!--<li><a href="#" class="icon solid fa-comment">128</a></li>-->
  					</ul>
  				</footer>
  			</article>`)
  }

  //sonraki sayfa acildiktan sonra sayfa basina scroll edilsin
  ui_elements.body.animate({
    scrollTop: 0
  }, "slow");

  locatePreviousNextPage(currPageNumber);
}

/*
  sonraki/onceki sayfa butonu ekleniyor
*/
function locatePreviousNextPage(currPageNumber) {

  consoleLog("locatePreviousNextPage : ", currPageNumber, " - ", pageCount);

  let paginationText = `<ul class="actions pagination">`;
  if (currPageNumber == 1) {
    paginationText += `<li id="previous_button"><a href="" class="pagination disabled button large previous">Önceki Sayfa</a></li>`;
  } else {
    // paginationText += `<li id="previous_button"><a onClick="nextPageClicked(` + parseInt(indicator - 3) + `)" class="pagination button large previous">Önceki Sayfa</a></li>`;
    paginationText += `<li id="previous_button"><a onClick="nextPageClicked(` + parseInt(currPageNumber - 1) + `)" class="pagination button large previous">Önceki Sayfa</a></li>`;
  }
  if (pageCount <= 1 || currPageNumber == pageCount) {
    paginationText += `<li id="next_button"><a href="" class="disabled pagination button large next">Sonraki Sayfa</a></li>`
  } else {
    // paginationText += `<li id="next_button"><a onClick="nextPageClicked(` + parseInt(indicator + 3) + `)" class="pagination button large next">Sonraki Sayfa</a></li>`
    paginationText += `<li id="next_button"><a onClick="nextPageClicked(` + parseInt(currPageNumber + 1) + `)" class="pagination button large next">Sonraki Sayfa</a></li>`
  }
  paginationText += `</ul>`;
  ui_elements.articles_main.append(paginationText)
}

/*
  kategorileri ekrana yerlestirir
*/
function locateCategories(serverData) {
  consoleLog("getCategories data len : ", serverData.length);

  for (var i = 0; i < serverData.length; i++) {
    if (i == 0) {
      ui_elements.ul_categories.append(`<li><a href="/category/` + serverData[i].blog_category_name + `">` + serverData[i].blog_category_name + `</a></li>`)
    } else {
      ui_elements.ul_categories.append(`<li><a href="/category/` + serverData[i].blog_category_name + `" class="a_category">` + serverData[i].blog_category_name + `</a></li>`)
    }
  }
}

/*
  en cok okunan makaleleri html e yerlestirir
*/
function locateMostReadArticles(serverData) {
  //onceki datalari siliyor
  ui_elements.div_most_read_articles.empty();

  //cok okunanlar basligi ekleniyor
  ui_elements.div_most_read_articles.append(`<h2>çok okunanlar</h2>`)

  //cok okunan makaleler ekleniyor
  for (var i = 0; i < serverData.length; i++) {
    var data = serverData[i];
    ui_elements.div_most_read_articles.append(`<article class="mini-post">
        <header>
          <h3><a href="single/` + data.id + `">` + data.article_title + `</a></h3>
          <time class="published" datetime="` + data.article_date + `">` + getFormattedDateTime(data.article_date, false) + `</time>
          <a href="#" class="author"><img src="images/avatar.jpg" alt="" /></a>
        </header>
        <a href="single/` + data.id + `" class="image"><img src="images/` + data.article_image + `" alt="" /></a>
      </article>`);
  }
}
