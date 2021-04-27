var map

function init() {
    _loadYoutubeApi(function() {
        map = new UtilityMap("map", "list", "video")
        _parseQuery()
    })
}

function _loadYoutubeApi(readyFunction) {
    let script = document.createElement("script")
    script.src = "https://www.youtube.com/iframe_api"

    let firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode.insertBefore(script, firstScriptTag)

    window.onYouTubeIframeAPIReady = readyFunction
}

async function _parseQuery() {
    let query = parseQuery(window.location.search)
    
    // Set map of the map query
    await loadMap(query.map == undefined ? "de_inferno" : query.map)

    // Try to select right utility
    let type = query.type
    let file = query.file

    if(type != undefined && file != undefined) {
        let layerType = map._types.get(type)
        if(layerType != undefined) {
            let layer = layerType.layer
    
            for (const marker of layer.getLayers()) {
                if(marker.point.file == file) {
                    map._showLocations(marker.point)
                    map._selectPoint(marker)
                    break
                }
            }
        }
    }
}

async function loadMap(mapName) {
    await map.loadMap(mapName)
}