class UtilityMap {

    constructor(div, name) {
        this._name = name

        this._setupMap(div)
        this._setupTypes()
        this._setupLayers()
        this._setupIcons()
    }

    _setupMap(div) {
        let self = this

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
        // DEBUG

        map.on("click", function (e) {
            self._unshowLocations()
        })

        this._map = map
    }

    _setupTypes() {
        let types = new Map()

        types.set("smoke", {})

        this._types = types
    }

    _setupLayers() {
        this._types.get("smoke").layer = new L.layerGroup().addTo(this._map)

        
        this._showLocationLayer = false
        this._locationLayer = new L.layerGroup().addTo(this._map)
    }

    _setupIcons() {
        this._types.get("smoke").icon = new L.Icon({
            iconUrl: "./assets/img/smoke.png",
            iconSize: [30, 30]
        })

        this._locationIcon = new L.Icon({
            iconUrl: "./assets/img/from_where.png",
            iconSize: [40, 40]
        })
    }
  
    async loadPoints() {
        let self = this
        let name = this._name

        let files = await (await fetch("./assets/json/" + name + "/load.json")).json()

        files.forEach(async function (file) {
            let point = await (await fetch("./assets/json/" + name + "/" + file)).json()

            self._addPoint(point)
        })
    }

    _addPoint(point) {
        let self = this
        let map = this._map

        let marker = L.marker([point.x, point.y], {
            icon: this._types.get(point.type).icon
        })

        marker.bindTooltip(point.name)

        marker.on("click", function (e) {
            self._showLocations(point.entries)
        })

        marker.addTo(this._types.get(point.type).layer)
    }

    _showLocations(locations) {
        let self = this

        this._showLocationLayer = true
        this._removeLocations()

        locations.forEach(function (location) {
            let marker = L.marker([location.x, location.y], {
                icon: self._locationIcon
            })

            marker.bindTooltip("<b>" + location.name + "</b><br />" + location.description)

            marker.addTo(self._locationLayer)
        })
    }

    _unshowLocations() {
        this._showLocationLayer = false
        this._removeLocations()
    }

    _removeLocations() {
        this._locationLayer.clearLayers()
    }
}
