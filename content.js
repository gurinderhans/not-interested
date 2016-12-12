/// on page load called when the page first loads into memory
// [source]: http://stackoverflow.com/questions/9899372/pure-javascript-equivalent-to-jquerys-ready-how-to-call-a-function-when-the#answer-13456810
window.readyHandlers = [];
window.ready = function ready(handler) {
  window.readyHandlers.push(handler);
  handleState();
};

window.handleState = function handleState() {
  if (['interactive', 'complete'].indexOf(document.readyState) > -1) {
    while(window.readyHandlers.length > 0) {
      (window.readyHandlers.shift())();
    }
  }
};

document.onreadystatechange = window.handleState;

/// page register for when the page dynamically loads using javascript
// [source]: http://stackoverflow.com/questions/18397962/chrome-extension-is-not-loading-on-browser-navigation-at-youtube#answer-18398921
(document.body || document.documentElement).addEventListener('transitionend', function(event) {
  if (event.propertyName === 'width' && event.target.id === 'progress') {
    onPageLoad();
  }
}, true);

window.ready(onPageLoad);


/// global variables
// keeps track of number of video elements by their unique class names
// so that when adding our custom button we only do it when this number
// has changed
var videoElementCount = {};


/// helper function that finds the parent of and element with given selector
// [source]: // TODO: find source
function findAncestor(el, sel) {
  while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el,sel)));
  return el;
}

function actionNotInterested(ev) {
  // find buttons parent wrapper element
  // then search back down for the click button
  var gridItem = findAncestor(ev.target, ev.target.getAttribute("max-parent-selector"));

  var contentMenuButton = gridItem.querySelector(".yt-uix-menu-container ul > li > button");
  contentMenuButton.click();
}

// there were some troubles if I used raw string for building the button
// when adding the onclick event, thats why there is this function
// to generate the button, where we nicely attach onto the onclick event

// @param: maxParentSelector = max up we can go for each of the video boxes
function makeNotInterestedButton(maxParentSelector) {
  var button = document.createElement("button");

  button.setAttribute("type",                 "button");
  button.setAttribute("role",                 "button");
  button.setAttribute("title",                "Not Interested");
  button.setAttribute("data-tooltip-text",    "Not Interested");
  button.setAttribute("aria-labelledby",      "yt-uix-tooltip441-arialabel");

  button.setAttribute("max-parent-selector",  maxParentSelector);

  button.className = "not-interested-action yt-uix-button yt-uix-button-size-small\
                      yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon\
                      no-icon-markup video-actions spf-nolink hide-until-delayloaded yt-uix-tooltip";

  button.onclick = actionNotInterested;

  return button;
}

function addNotInterestedToEl(
  // selector of top-most-level video box
  videoBoxSelector,
  // selector of the box that we are adding the element into
  insertIntoElSelector
) {
  try {

    var lastCount = videoElementCount[videoBoxSelector] || 0;

    var videoElements = document.querySelectorAll(videoBoxSelector);

    if (lastCount == videoElements.length) {
      return;
    }

    for (var i = 0; i < videoElements.length; ++i) {

      var insertEl = videoElements[i].querySelector(insertIntoElSelector);
      if (insertEl.querySelector(".not-interested-action") !== null) {
        continue;
      }

      var notInterestedButton = makeNotInterestedButton(videoBoxSelector);
      insertEl.appendChild(notInterestedButton);
    }
    
    videoElementCount[videoBoxSelector] = videoElements.length;

  } catch (err) {
    console.error(err);
  }
}


function onPageLoad() {
  console.log("load");
  
  /// FIXME: adding this causes entire page to repaint, which becomes visible
  /// on a heavy site like youtube, best to inline styles ?
  // add custom styles
  document.head.innerHTML += '<style type="text/css">\
    .not-interested-action {\
      height: 22px;\
      width: 22px;\
      padding: 0;\
      border-radius: 2px;\
    }\
    .not-interested-action::before {\
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllryam5.webp) -296px -215px;\
      background-size: auto;\
      width: 13px;\
      height: 13px;\
    }\
    .contains-percent-duration-watched .not-interested-action {\
      margin-bottom: 4px;\
    }\
    .yt-lockup-thumbnail.contains-addto:hover .not-interested-action,\
    .related-list-item:hover .not-interested-action {\
      right: 26px;\
    }\
    </style>';

  // TODO: only call the timer when page is scrolling ?

  // interval to take care of dynamically added elements
  setInterval(function() {
    addNotInterestedToEl(
      ".expanded-shelf-content-item-wrapper",
      ".yt-lockup-thumbnail"
    );

    addNotInterestedToEl(
      ".yt-shelf-grid-item > .yt-lockup.yt-lockup-grid.yt-lockup-video",
      ".yt-lockup-thumbnail"
    );

    addNotInterestedToEl(
      ".related-list-item",
      ".thumb-wrapper"
    );

  }, 1000);
}

