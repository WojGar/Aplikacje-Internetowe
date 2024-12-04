/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


var styles = {
  "Styl 1": "Styles/Styl1.css",
  "Styl 2": "Styles/Styl2.css",
  "Styl 3": "Styles/Styl3.css"
};
var currentStyle = null;
/**
 * @param styleName .
 */
function changeStyle(styleName) {
  var head = document.head;
  var currentLink = document.querySelector("link[rel='stylesheet']");
  if (currentLink) {
    head.removeChild(currentLink);
  }
  var newLink = document.createElement("link");
  newLink.rel = "stylesheet";
  newLink.href = styles[styleName];
  head.appendChild(newLink);
  currentStyle = styleName;
  console.log("Zmieniono styl na: ".concat(styleName));
}
function initializeStyleList() {
  var styleLinkContainer = document.querySelector(".style-link");
  if (!styleLinkContainer) {
    console.error("Nie znaleziono kontenera linków stylów!");
    return;
  }
  var ul = document.createElement("ul");
  Object.keys(styles).forEach(function (styleName) {
    var li = document.createElement("li");
    var link = document.createElement("a");
    link.textContent = styleName;
    link.href = "#";
    link.addEventListener("click", function (event) {
      event.preventDefault();
      changeStyle(styleName);
    });
    li.appendChild(link);
    ul.appendChild(li);
  });
  styleLinkContainer.innerHTML = "";
  styleLinkContainer.appendChild(ul);
}
document.addEventListener("DOMContentLoaded", function () {
  initializeStyleList();
  changeStyle("Styl 1");
});
/******/ })()
;