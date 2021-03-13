function init() {
    _loadYoutubeApi(function() {
        _loadMap("de_inferno")
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
    let map = new UtilityMap("map", "list", "video", mapName)
    map.loadPoints()
}