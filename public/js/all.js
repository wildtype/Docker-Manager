!function t(n,e,a){function r(o,s){if(!e[o]){if(!n[o]){var c="function"==typeof require&&require;if(!s&&c)return c(o,!0);if(i)return i(o,!0);var u=new Error("Cannot find module '"+o+"'");throw u.code="MODULE_NOT_FOUND",u}var d=e[o]={exports:{}};n[o][0].call(d.exports,function(t){var e=n[o][1][t];return r(e?e:t)},d,d.exports,t,n,e,a)}return e[o].exports}for(var i="function"==typeof require&&require,o=0;o<a.length;o++)r(a[o]);return r}({1:[function(t,n,e){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}var r=t("./docker_manager"),i=a(r);window.DockerManager=i.default},{"./docker_manager":2}],2:[function(t,n,e){"use strict";function a(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,n){for(var e=0;e<n.length;e++){var a=n[e];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}return function(n,e,a){return e&&t(n.prototype,e),a&&t(n,a),n}}(),i=function(){function t(){var n=this;a(this,t),this.sel={containerList:".docker-manager__container-list"},this.classNames={containerItem:"docker-manager__container-item",actionButton:"docker-manager__container-action",startContainerButton:"docker-manager__container-action--start",stopContainerButton:"docker-manager__container-action--stop"},this.loadContainers(),document.addEventListener("click",function(t){var e=t.target;e.classList.contains(n.classNames.startContainerButton)?n.startContainer.bind(n)(t):e.classList.contains(n.classNames.stopContainerButton)&&n.stopContainer.bind(n)(t)})}return r(t,[{key:"loadContainers",value:function(){var t=this,n=new XMLHttpRequest;n.open("GET","/containers/json?all=1"),n.onload=function(){200===n.status&&t.displayContainers.bind(t)(JSON.parse(n.response))},n.send()}},{key:"displayContainers",value:function(t){var n=document.querySelector(this.sel.containerList);n.innerHTML="",t.forEach(function(t){var e=document.createElement("div");e.classList.add(this.classNames.containerItem),e.innerHTML="\n        <div class=docker-manager__container-name>"+t.Names[0].slice(1)+"</div>\n        <div class=docker-manager__container-image>"+t.Image+"</div>\n        <div class=docker-manager__container-status>"+t.Status+"</div>\n      ",e.appendChild(this.createStartStopButton(t)),n.appendChild(e)}.bind(this))}},{key:"createStartStopButton",value:function(t){var n=document.createElement("button");return n.classList.add(this.classNames.actionButton),n.setAttribute("data-container-id",t.Id),"running"===t.State?(n.classList.add(this.classNames.stopContainerButton),n.innerHTML="Stop"):(n.classList.add(this.classNames.startContainerButton),n.innerHTML="Start"),n}},{key:"startContainer",value:function(t){t.stopPropagation();var n=t.target,e=n.getAttribute("data-container-id");if(e){n.setAttribute("disabled",!0);var a=new XMLHttpRequest;a.open("POST","/containers/"+e+"/start"),a.onload=this.loadContainers.bind(this),a.send()}}},{key:"stopContainer",value:function(t){t.stopPropagation();var n=t.target,e=n.getAttribute("data-container-id");if(e){n.setAttribute("disabled",!0);var a=new XMLHttpRequest;a.open("POST","/containers/"+e+"/stop"),a.onload=this.loadContainers.bind(this),a.send()}}}]),t}();e.default=i},{}]},{},[1]);