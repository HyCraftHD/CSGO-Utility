var map

var delayedSetLocation = null

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

    window._onYoutubePlayerReady = function() {
        if(delayedSetLocation != null) {
            map._selectLocation(delayedSetLocation)
            delayedSetLocation = null
        }
    }
}

async function _parseQuery() {
    let query = parseQuery(window.location.search)
    
    // Set map of the map query
    await loadMap(query.map == undefined ? "de_inferno" : query.map)

    // Try to select right utility
    let type = query.type
    let file = query.file
    let entry = query.entry

    // Check if type and file is set
    if(type != undefined && file != undefined) {

        // Try to select utility
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

        // Try to select right location of utility
        if(entry != undefined) {
            let layer = map._locationLayer

            for (const marker of layer.getLayers()) {
                if(marker.location.name.toUpperCase() == entry.toUpperCase()) {
                    delayedSetLocation = marker
                    break
                }
            }
        }
    }
}

async function loadMap(mapName) {
    await map.loadMap(mapName)
}