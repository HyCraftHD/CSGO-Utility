var map

function init() {
    _loadYoutubeApi(function() {
        map = new UtilityMap("map", "list", "video")
        if(window.location.hash) {
            loadMap(window.location.hash.slice(1))
        } else {
            loadMap("de_inferno")
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

function loadMap(mapName) {
    map.loadMap(mapName)
}