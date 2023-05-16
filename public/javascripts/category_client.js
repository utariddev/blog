class UI {
  category_main = null;
  wait = null;
  loader_main = null;
  wait_loader_text = null;
  wait_loader_time = null;
  constructor() {
    consoleLog("ui constructor")
    this.category_main = $("#main");
    this.wait = $("#wait");
    this.loader_main = $("#wait_loader");
    this.wait_loader_text = $("#wait_loader_text");
    this.wait_loader_time = $("#wait_loader_time");
  }
}

class LoadingScreen {
  is_get_category_articles_done = null;
  is_get_category_articles_success = null;
  constructor() {
    this.is_get_category_articles_done = false;
    this.is_get_category_articles_success = false;
  }
}

var ui_elements = null;
var loading_screen = null;
var timer = new easytimer.Timer();

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
  if (loading_screen.is_get_category_articles_done) {
    if (loading_screen.is_get_category_articles_success) {
      ui_elements.loader_main.removeClass("custom_loader");
      ui_elements.wait.addClass("display_none");
    } else {
      ui_elements.loader_main.removeClass("custom_loader");
      ui_elements.wait_loader_text.text("bir şey bozuk. bi ara tekrar dene");
    }
  }
  timer.stop();
}

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
  consoleLog("documentReady");
  let category_name = getCategoryNameFromURL();
  createClass();
  showLoadingScreen();
  //category_name int olmali ve bos olmamali
  if (category_name != null) {
    getCategoryArticles(category_name);
  }
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
  url den category ismini alir
*/
function getCategoryNameFromURL() {
  let url = window.location.href;
  let url_array = url.split("/");
  let category_name = url_array[url_array.length - 1];
  consoleLog("category_name : " + category_name)

  return category_name;
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
  getCategoryArticles post request
*/
function getCategoryArticles(category_name) {
  consoleLog("getCategoryArticles : " + category_name)

  $.ajax({
    url: '/getCategoryArticles/' + category_name,
    type: 'GET',
    dataType: 'json',
    success: (data) => {
      consoleLog("getCategoryArticles client response from server : ", data);

      loading_screen.is_get_category_articles_done = true;

      if (data.result.code == 1) {
        loading_screen.is_get_category_articles_success = true
        locateCategoryArticles(data.data);
        hideLoadingScreen()
      } else {
        loading_screen.is_get_category_articles_success = false
        hideLoadingScreen()
        // hideLoadingAndShowError()
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      loading_screen.is_get_category_articles_success = false;
      loading_screen.is_get_category_articles_done = true;

      consoleLog("getCategoryArticles error, XMLHttpRequest : ", XMLHttpRequest);
      consoleLog("getCategoryArticles error, textStatus : ", textStatus);
      consoleLog("getCategoryArticles error, errorThrown : ", errorThrown);

      hideLoadingScreen()
    }
  });
}

/*
  makale datasini html e yerlestirir
*/
function locateCategoryArticles(serverData) {
  for (var i = 0; i < serverData.length; i++) {
    var data = serverData[i];
    ui_elements.category_main.append(`<article class="post">
  				<header>
  					<div class="category_number_div">
  						<span class="category_number_span">` + parseInt(i + 1) + `</span>
  					</div>
  					<div class="title">
  						<h2><a href="/single/` + data.article_web_title + `">` + data.article_title + `</a></h2>
  					</div>
  					<div class="meta">
  						<time class="published" datetime="` + data.article_date + `">` + getFormattedDateTime(data.article_date) + `</time>
  						<a href="#" class="author">
                <span class="name">` + data.author_name + `</span>
                <img src="https://i.ibb.co/5K7Myvm/avatar.jpg" alt="avatar" border="0">
              </a>
  					</div>
  				</header>
  			</article>
    `)
  }
}
