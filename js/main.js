var map;

function init() {
    _loadYoutubeApi(function() {
        if(window.location.hash) {
            _loadMap(window.location.hash.slice(1));
        } else {
            _loadMap("de_inferno");
        }

    })
}

function _loadYoutubeApi(readyFunction) {
    let script = document.createElement("script")
    script.src = "https://www.youtube.com/iframe_api"

    let firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode.insertBefore(script, firstScriptTag)

    window.onYouTubeIframeAPIReady = readyFunction
}

function _loadMap(mapName) {
    map = new UtilityMap("map", "list", "video", mapName)

    map.loadPoints()
}

function changeMap(mapName) {
    map._name = mapName;
    map._destroyMap();
    map._setupMap("map");
    map._setupLayers()
    map.loadPoints();


}