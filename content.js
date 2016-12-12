/// global variables

// keeps track of number of video elements
// by their unique class names
var videoElementCount = {};


function findAncestor (el, sel) {
  while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el,sel)));
  return el;
}

function actionNotInterested(ev) {
  // find buttons parent wrapper element
  var gridItem = findAncestor(ev.target, ".yt-lockup-dismissable");

  var contentMenuButton = gridItem.querySelector(".yt-lockup-content >\
                                                  .yt-uix-menu-container.yt-lockup-action-menu\
                                                  ul > li > button");
  contentMenuButton.click();
}

// there were some troubles if I used raw string for building the button
// when adding the onclick event, thats why there is this function
// to generate the button, where we nicely attach onto the onclick event
function makeNotInterestedButton() {
  var button = document.createElement("button");

  button.setAttribute("type",                 "button");
  button.setAttribute("role",                 "button");
  button.setAttribute("title",                "Not Intersted");
  button.setAttribute("data-tooltip-text",    "Not Intersted");
  button.setAttribute("aria-labelledby",      "yt-uix-tooltip441-arialabel");

  button.className = "not-interested-action yt-uix-button yt-uix-button-size-small\
                      yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon\
                      no-icon-markup video-actions spf-nolink hide-until-delayloaded yt-uix-tooltip";

  button.onclick = actionNotInterested;

  return button;
}

function addNotInterstedButtonWithClass(className) {
  var videoElements = document.getElementsByClassName(className);

  var lastCount = videoElementCount[className] || 0;

  if (lastCount < videoElements.length) {

    for (var i = 0; i < videoElements.length; ++i) {

      var thumbnail = videoElements[i].querySelector(".yt-lockup-thumbnail.contains-addto");

      // don't add thumbnail if already added
      if(thumbnail.getElementsByClassName("not-interested-action").length > 0) {
        continue;
      }

      var notInterestedButton = makeNotInterestedButton();

      thumbnail.appendChild(notInterestedButton);
    }

    videoElementCount[className] = videoElements.length;
  }
}

function initExtension() {
  // add custom styles
  document.head.innerHTML += '<style type="text/css">\
    .yt-lockup-thumbnail.contains-addto .not-interested-action {\
      height: 22px;\
      width: 22px;\
      padding: 0;\
      border-radius: 2px;\
    }\
    .yt-lockup-thumbnail.contains-addto .not-interested-action::before {\
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllryam5.webp) -296px -215px;\
      background-size: auto;\
      width: 13px;\
      height: 13px;\
    }\
    .yt-lockup-thumbnail.contains-addto:hover .not-interested-action {\
      right: 26px;\
    }\
    </style>';

  // interval to take care of dynamically added elements
  setInterval(function() {
    addNotInterstedButtonWithClass("expanded-shelf-content-item-wrapper");
    addNotInterstedButtonWithClass("yt-shelf-grid-item");
  }, 500);
}

// add onto onload event for our own init process
if (window.addEventListener) {
  window.addEventListener('load', initExtension);
} else {
  window.attachEvent('onload', initExtension);
}
