// `x` marked at (-296px -215px)
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

function initExtension() {
  // add custom styles
  document.head.innerHTML += '<style type="text/css">\
    .yt-lockup-thumbnail.contains-addto .not-interested-action {\
      height: 22px;\
      width: 22px;\
      padding: 0;\
      border-radius: 2px;\
    }\
    .yt-lockup-thumbnail.contains-addto:hover .not-interested-action {\
      right: 26px;\
    }\
    </style>';

  var videoElements = document.getElementsByClassName("yt-shelf-grid-item");
  for (var i = 0; i < videoElements.length; ++i) {
    var thumbnail = videoElements[i].querySelector(".yt-lockup-thumbnail.contains-addto");

    var notInterestedButton = makeNotInterestedButton();

    thumbnail.appendChild(notInterestedButton);
  }
}

// add onto onload event for our own init process
if (window.addEventListener) {
  window.addEventListener('load', initExtension);
} else {
  window.attachEvent('onload', initExtension);
}
