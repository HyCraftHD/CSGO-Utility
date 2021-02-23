function Map(div, name) {   
    var bounds = [[0,0], [800,800]]

    var map = L.map(div, {
        crs: L.CRS.Simple,
        attributionControl: false
    })

    L.imageOverlay("./assets/img/" + name + "_map.png", bounds).addTo(map)

    map.setView([400, 400], 0)

    map.setMaxBounds(bounds)
    map.on("drag", function() {
        map.panInsideBounds(bounds, { 
            animate: false
        })
    });
    
    map.fitBounds(bounds)

    map.on("contextmenu", function (event) {
        alert("Map Coordinates are: " + event.latlng.toString())
    });

    map.doubleClickZoom.disable()

    let object = this;
    map.on("click", function(e) {  
        object.clearTmpPoints()
    })

    this.name = name
    this.map = map
    this.tmpMarkers = []
}

Map.prototype.loadPoints = async function() {
    let object = this;
    let name = this.name

    let files = await (await fetch("./assets/json/" + name + "/load.json")).json()
    
    files.forEach(async function(file) {
        let json = await (await fetch("./assets/json/" + name + "/" + file)).json()

        object.addPoint(json)
    })
}

Map.prototype.clearTmpPoints = function() {
    if (this.tmpMarkers.length != 0) {
        this.tmpMarkers.forEach(function(locMarker) {
            this.map.map.removeLayer(locMarker)
        })
        this.tmpMarkers.splice(0, this.tmpMarkers.length)
        return true
    }
    return false
}

Map.prototype.addPoint = function(point) {
    let object = this;
    let map = this.map

    var greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    
    let marker = L.marker([point.x, point.y], {
        icon: greenIcon,
        locations: point.entries
    })

    marker.bindTooltip("Test Label",  {
        permanent: false, 
        direction: 'right'
    })

    marker.on("click", function(e) {
        if (!object.clearTmpPoints()) {
            this.options.locations.forEach(function(location) {
                let locMarker = L.marker([location.x, location.y])
                locMarker.addTo(map)
                object.tmpMarkers.push(locMarker)
            })
        }
    })
    marker.addTo(map)
}

Map.prototype.getMap = function () {
    return this.map
}
