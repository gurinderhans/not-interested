/// MARK: on page load called when the page first loads into memory.
/// Source: http://stackoverflow.com/questions/9899372/pure-javascript-equivalent-to-jquerys-ready-how-to-call-a-function-when-the#answer-13456810
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

/// MARK: page register for when the page dynamically loads using javascript.
/// Source: http://stackoverflow.com/questions/18397962/chrome-extension-is-not-loading-on-browser-navigation-at-youtube#answer-18398921
(document.body || document.documentElement).addEventListener('transitionend', function(event) {
  if (event.propertyName === 'width' && event.target.id === 'progress') {
    onPageLoad();
  }
}, true);

window.ready(onPageLoad);

function elog(obj) {
  console.info("[not-interested]::" + obj);
}

/// Helper function that finds the parent of and element with given selector.
function findAncestor(el, sel) {
  while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el,sel)));
  return el;
}

function actionNotInterested(ev) {

  ev.preventDefault();
  ev.stopPropagation();

  // find buttons parent wrapper element
  // then search back down for the click button
  var gridItem = findAncestor(ev.target, ev.target.getAttribute("max-parent-selector"));

  var menuButton = gridItem.querySelector("#menu #button");
  menuButton.click();

  var popupRenderer = document.querySelector("ytd-menu-popup-renderer");
  if (popupRenderer) {
    popupRenderer.style.opacity=0;
  }

  setTimeout(function(){
    document.querySelector("#items > div > ytd-menu-service-item-renderer:nth-child(1)").click();

    if (popupRenderer) {
      popupRenderer.style.display='none';
      popupRenderer.style.opacity=1;
    }

  }, 10);
  
  return false;
}

// there were some troubles if I used raw string for building the button
// when adding the onclick event, thats why there is this function
// to generate the button, where we nicely attach onto the onclick event

// @param: maxParentSelector = max up we can go for each of the video boxes
function makeNotInterestedButton(maxParentSelector) {

  var button = document.createElement("button");

  button.setAttribute("role", "button");
  button.setAttribute("tabindex", "1");
  button.setAttribute("aria-label", "Not interested");

  button.className = "not-interested-action style-scope ytd-thumbnail";

  button.setAttribute("max-parent-selector",  maxParentSelector);

  button.innerHTML=`
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
      <g class="style-scope yt-icon">
        <line stroke-linecap="round" y2="7" x2="17" y1="17" x1="7" stroke-width="2.5" stroke="#fff" fill="#fff" />
        <line stroke-linecap="round" y2="17" x2="17" y1="7" x1="7" stroke-width="2.5" stroke="#fff" fill="#fff" />
      </g>
    </svg>
  `;

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

    var videoElements = document.querySelectorAll(videoBoxSelector);
    for (var i=0; i<videoElements.length; ++i) {

      var insertEl = videoElements[i].querySelector(insertIntoElSelector);
      if (insertEl.querySelector(".not-interested-action") !== null) {
        continue;
      }

      var notInterestedButton = makeNotInterestedButton(videoBoxSelector);
      insertEl.appendChild(notInterestedButton);
    }
  } catch (err) {
    console.error(err);
  }
}


function onPageLoad() {
  elog("Loaded");

  setInterval(function() {
    addNotInterestedToEl("ytd-grid-video-renderer", "#overlays");
    addNotInterestedToEl("ytd-video-renderer", "#overlays");
    addNotInterestedToEl("ytd-compact-autoplay-renderer", "#overlays");
    addNotInterestedToEl("ytd-compact-video-renderer", "#overlays");
  }, 2000);

  document.head.innerHTML += `<style type="text/css">
    .not-interested-action {
      position: absolute;
      top: 4px;
      right: 40px;
      width: 28px;
      height: 28px;
      background: black;
      border: none;
      border-radius: 2px;
      padding: 0px;
      cursor: pointer;
      transition: opacity 0.3s;
      visibility: hidden;
      opacity: 0;
    }

    .style-scope.ytd-grid-video-renderer:hover .not-interested-action,
    .style-scope.ytd-grid-video-renderer:hover .not-interested-action,
    .style-scope.ytd-video-renderer:hover .not-interested-action,
    .style-scope.ytd-compact-autoplay-renderer:hover .not-interested-action,
    .style-scope.ytd-compact-video-renderer:hover .not-interested-action
    {
      visibility: visible;
      opacity: 0.7;
    }
    </style>`;
}
