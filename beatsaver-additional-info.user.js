// ==UserScript==
// @name         BeatSaver Additional Information
// @description  Add properties to BeatSaver map pages
// @author       AntiLink
// @version      0.0.1
// @match        https://beatsaver.com/*
// @downloadURL  https://raw.githubusercontent.com/AntiLink99/beatsaver-additional-info/main/beatsaver-additional-info.user.js
// @updateURL    https://raw.githubusercontent.com/AntiLink99/beatsaver-additional-info/main/beatsaver-additional-info.user.js
// ==/UserScript==

(function() {
    'use strict';

    function getMapId() {
        let split = document.URL.split("/");
        return split[split.length-1];
    }

    function onLoadDelay() {
        let mapPropertiesList = document.querySelector("#root > div.row.mt-3 > div.col-lg-4.text-nowrap > div:nth-child(1)");
        if (mapPropertiesList && document.URL.toLowerCase().startsWith("https://beatsaver.com/maps/")) {
            let downloadsProperty = document.createElement('div');
            downloadsProperty.innerHTML = '<div id="map-downloads" class="list-group-item d-flex justify-content-between">Downloads<span id="map-downloads-value" class="text-truncate ml-4">Loading...</span></div>';
            if (document.getElementById("map-downloads") !== null) {
                return;
            }
            mapPropertiesList.appendChild(downloadsProperty.firstChild);
            let mapId = getMapId();
            let response = fetch("https://api.beatsaver.com/maps/id/"+mapId).then(response => response.json()).then(json => {
                let downloadValue;
                if (!json) {
                    return;
                }
                downloadValue = json.stats.downloads;
                document.getElementById('map-downloads-value').innerHTML = downloadValue;
            });
        }
    }

    function onLoad() {
        if (document.getElementById("map-downloads") === null) {
            onLoadDelay();
            setTimeout(onLoadDelay, 500);
        }
    }

    history.pushState = ( f => function pushState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.pushState);

    history.replaceState = ( f => function replaceState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate',()=>{
        window.dispatchEvent(new Event('locationchange'))
    });

    onLoad();
    window.addEventListener("DOMContentLoaded", onLoad);
    window.addEventListener("load", onLoad);
    window.addEventListener("refresh", onLoad);
    window.addEventListener("locationchange", onLoad);
})();
