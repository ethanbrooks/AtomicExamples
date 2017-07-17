"atomic component";

var WIDTH = Atomic.graphics.width - 100;
var HEIGHT = Atomic.graphics.height - 100;

var home = "https://www.atomicgameengine.com";

var bookmarks = {
  "Atomic": "https://www.atomicgameengine.com",
  "Google": "https://www.google.com",
  "YouTube": "https://www.youtube.com",
  "Steam": "https://store.steampowered.com",
  "Reddit": "https://www.reddit.com/r/gamedev",
  "Penny Arcade": "https://www.penny-arcade.com/"
};

// Create the UI view
var view = new Atomic.UIView();

var newTabButton;
var newTabContent;

// WebBrowser example component
exports.component = function(self) {

  var window = new Atomic.UIWindow();
  window.text = "UIPlatformWebView Example";
  window.setSize(WIDTH, HEIGHT);

  var mainLayout = new Atomic.UILayout();
  mainLayout.axis = Atomic.UI_AXIS.UI_AXIS_Y;
  mainLayout.layoutDistribution = Atomic.UI_LAYOUT_DISTRIBUTION.UI_LAYOUT_DISTRIBUTION_GRAVITY;
  mainLayout.gravity = Atomic.UI_GRAVITY.UI_GRAVITY_ALL;

  var tabContainer = new Atomic.UITabContainer();
  tabContainer.gravity = Atomic.UI_GRAVITY.UI_GRAVITY_ALL;

  newTabButton = new Atomic.UIButton();
  newTabButton.text = " ";
  newTabButton.onClick = function() {
    createBrowserTab(tabContainer, home);
    // set the current page to the created page (ignoring the new tab dummy page)
    tabContainer.currentPage = tabContainer.numPages - 2;
    return true;
  };

  newTabContent = new Atomic.UIWidget();

  tabContainer.tabLayout.addChild(newTabButton);
  tabContainer.contentRoot.addChild(newTabContent);

  // change id, so we don't initiate a page change when clicked
  newTabButton.id = "NewTabButton";

  // create a startup with our home address
  createBrowserTab(tabContainer, home);
  tabContainer.currentPage = 0;

  // Add to main UI view and center
  mainLayout.addChild(tabContainer);
  window.addChild(mainLayout);
  view.addChild(window);
  window.center();

};

function createBookmarks(webView, layout,  bookmarks) {

  for (var text in bookmarks) {

    var button = new Atomic.UIButton();
    button.text = text;
    button.skinBg = "TBButton.flat";

    // button layout and font desc
    var buttonLP = new Atomic.UILayoutParams();
    buttonLP.width = 120,
    buttonLP.height = 18;
    button.layoutParams = buttonLP;

    var fontDesc = new Atomic.UIFontDescription();
    fontDesc.size = 11;
    fontDesc.id = "Vera";
    button.fontDescription = fontDesc;

    layout.addChild(button);

    (function() {
      var url = bookmarks[text];
      button.onClick = function() { webView.loadURL(url); };
    })();
  }
}

function createBrowserTab(tabContainer, url) {

  var contentRoot = tabContainer.contentRoot;
  var tabLayout = tabContainer.tabLayout;

  var layout = new Atomic.UILayout();
  layout.axis = Atomic.UI_AXIS_Y;
  layout.layoutDistribution = Atomic.UI_LAYOUT_DISTRIBUTION.UI_LAYOUT_DISTRIBUTION_GRAVITY;
  layout.gravity = Atomic.UI_GRAVITY.UI_GRAVITY_ALL;
  layout.spacing = 8;

  var tabButton = new Atomic.UIButton();
  tabButton.text = "Atomic Game Engine";

  // button layout and font desc
  var buttonLP = new Atomic.UILayoutParams();
  buttonLP.width = 160,
  buttonLP.height = 32;
  tabButton.layoutParams = buttonLP;

  var fontDesc = new Atomic.UIFontDescription();
  fontDesc.size = 11;
  fontDesc.id = "Vera";
  tabButton.fontDescription = fontDesc;

  // tabButtons with URL text by default open the URL upon clicking them
  // we don't want this behaviour
  tabButton.urlEnabled = false;
  tabLayout.addChildBefore(tabButton, newTabButton);

  // address bar
  var addressLayout = new Atomic.UILayout();
  addressLayout.gravity = Atomic.UI_GRAVITY.UI_GRAVITY_ALL;
  addressLayout.layoutDistribution = Atomic.UI_LAYOUT_DISTRIBUTION.UI_LAYOUT_DISTRIBUTION_GRAVITY;

  // navigation buttons
  var backButton = new Atomic.UIButton();
  backButton.text = "Back";
  addressLayout.addChild(backButton);

  var fwdButton = new Atomic.UIButton();
  fwdButton.text = "Forward";
  addressLayout.addChild(fwdButton);

  var reloadButton = new Atomic.UIButton();
  reloadButton.text = "Reload";
  addressLayout.addChild(reloadButton);

  var homeButton = new Atomic.UIButton();
  homeButton.text = "Home";
  addressLayout.addChild(homeButton);

  var addressEdit = new Atomic.UIEditField();
  addressEdit.text = "https://www.atomicgameengine.com";
  addressEdit.gravity = Atomic.UI_GRAVITY.UI_GRAVITY_ALL;
  addressLayout.addChild(addressEdit);

  layout.addChild(addressLayout);

  var webView = new Atomic.UIPlatformWebView();
  webView.gravity = Atomic.UI_GRAVITY.UI_GRAVITY_ALL;

  webView.setFocus(true);
  webView.loadURL(home);

  // bookmark bar
  var bookmarkLayout = new Atomic.UILayout();
  bookmarkLayout.gravity = Atomic.UI_GRAVITY.UI_GRAVITY_ALL;

  createBookmarks( webView, bookmarkLayout, bookmarks);

  layout.addChild(bookmarkLayout);
  layout.addChild(webView);
  contentRoot.addChildBefore(layout, newTabContent);

  // initial state
  // reloadButton.disable();
  // backButton.disable();
  // fwdButton.disable();

  // go home
  homeButton.onClick = function() { webView.loadURL(home); }

  // reload
  reloadButton.onClick = function() { webView.reload(); };

  // Forward/Back
  fwdButton.onClick = function() { webView.goForward(); };

  backButton.onClick = function() { webView.goBack(); };

  webView.subscribeToEvent(addressEdit, Atomic.UIWidgetEditCompleteEvent(function(ev) {

      var url = addressEdit.text;

      url = url.replace(" ", "%20");

      if (url.indexOf(".") == -1) {
        url = "http://www.google.com/search?q=" + url;
      }

      if (url.indexOf("://") == -1) {
          url = "https://" + url;
      }

      if (!url.length)
        return;

    webView.request(url);

  }));
}
