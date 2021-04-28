var map

var delayedSetLocation = null

function init() {
    _loadYoutubeApi(function() {
        map = new UtilityMap("map", "list", "video")
        _parseQuery()
    })

    // Will be called when back / forward button is pressed
    window.onpopstate = function(event) {
        _parseQuery()
    }
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
    
    // Set map of the map query (default is de_inferno)
    let selectedMap = query.map == undefined ? "de_inferno" : query.map

    // Change url to map if not set
    if(query.map == undefined) {
        replaceHistory({map: selectedMap})
    }

    await map.loadMap(selectedMap)

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
    addHistory({"map": mapName})
    await map.loadMap(mapName)
}