class Map {

    constructor(div, name) {
        this._name = name

        this._setupMap(div)    
        this._setupLayers()
        this._setupIcons()
    }

    _setupMap(div) {
        let name = this._name

        let bounds = [[0, 0], [800, 800]]

        let map = L.map(div, {
            crs: L.CRS.Simple,
            attributionControl: false
        })

        L.imageOverlay("./assets/img/" + name + "_map.png", bounds).addTo(map)

        map.setView([400, 400], 0)
        map.setMaxBounds(bounds)
        map.fitBounds(bounds)
        map.doubleClickZoom.disable()
        map.on("drag", function () {
            map.panInsideBounds(bounds, {
                animate: false
            })
        })

        // DEBUG
        map.on("contextmenu", function (event) {
            alert("Map Coordinates are: " + event.latlng.toString())
        })
        map.on("click", function (e) {
            clearTmpPoints()
        })
        // DEBUG

        this._map = map
    }

    _setupLayers() {
        this._smokeLayer = new L.layerGroup().addTo(this._map)
    }

    _setupIcons() {
        this._smokeIcon = new L.Icon({
            iconUrl: "./assets/img/smoke.png",
            iconSize: [30, 30]
        })
    }
  
    async loadPoints() {
        let self = this
        let name = this._name

        let files = await (await fetch("./assets/json/" + name + "/load.json")).json()

        files.forEach(async function (file) {
            let json = await (await fetch("./assets/json/" + name + "/" + file)).json()

            self.addPoint(json)
        })
    }

    addPoint(point) {
        let self = this
        let map = this._map

        let marker = L.marker([point.x, point.y], {
            icon: self._smokeIcon,
            locations: point.entries
        })

        marker.bindTooltip(point.name, {
            permanent: false
        })

        marker.on("click", function (e) {
            if (!self.clearTmpPoints()) {
                this.options.locations.forEach(function (location) {

                    var fromWhere = new L.Icon({
                        iconUrl: "./assets/img/from_where.png",
                        iconSize: [40, 40]
                    })

                    let locMarker = L.marker([location.x, location.y], {
                        icon: fromWhere,
                        location: location
                    })

                    locMarker.bindTooltip(location.name + "<br />" + location.description, {
                        permanent: false
                    })

                    locMarker.on("click", function (e) {
                        console.log(this.options.location.youtube) // TODO debug
                        document.getElementById("youtube-player").src = "https://www.youtube.com/embed/" + this.options.location.youtube + "?wmode=opaque&rel=0&autoplay=1"
                        document.getElementById("overlay").style.display = "block"
                    })

                    locMarker.addTo(map)
                    self.tmpMarkers.push(locMarker)
                })
            }
        })
        marker.addTo(this._smokeLayer)
    }

    clearTmpPoints() {
        let object = this
        if (this.tmpMarkers.length != 0) {
            this.tmpMarkers.forEach(function (locMarker) {
                object.map.removeLayer(locMarker)
            })
            this.tmpMarkers.splice(0, this.tmpMarkers.length)
            return true
        }
        return false
    }

    getMap() {
        return this.map
    }
}
