var map;

function init() {
    _loadYoutubeApi(function() {
        if(window.location.hash) {
            _createMap(window.location.hash.slice(1))
        } else {
            _createMap("de_inferno")
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

function _createMap(mapName) {
    map = new UtilityMap("map", "list", "video")
    loadMap(mapName)
}

function loadMap(mapName) {
    map.loadMap(mapName)
}