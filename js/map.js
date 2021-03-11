class UtilityMap {

    constructor(divMap, divList, name) {
        this._name = name

        this._list = document.getElementById(divList)

        this._setupMap(divMap)
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
            self._unselectLocation()
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
            iconSize: [30, 30],
            className: "map-marker"
        })

        this._types.get("smoke").selectedIcon = new L.Icon({
            iconUrl: "./assets/img/smoke_selected.png",
            iconSize: [30, 30],
            className: "map-marker"
        })

        this._locationIcon = new L.Icon({
            iconUrl: "./assets/img/from_where.png",
            iconSize: [20, 20]
        })

        this._locationIconSelected = new L.Icon({
            iconUrl: "./assets/img/from_where_selected.png",
            iconSize: [20, 20]
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
            normalIcon: this._types.get(point.type).icon,
            selectedIcon: this._types.get(point.type).selectedIcon
        })

        marker.setIcon(marker.options.normalIcon)

        marker.bindTooltip("<b>" + point.name + "</b>")

        marker.on("click", function (e) {
            self._showLocations(point.entries)
            self._selectPoint(marker)
            self._updateList(point)
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

            marker.on("click", function (e) {
                self._unselectLocation()
                self._selectLocation(marker)
            })

            marker.addTo(self._locationLayer)
        })
    }

    _unshowLocations() {
        this._showLocationLayer = false
        this._removeLocations()
    }

    _removeLocations() {
        this._locationLayer.clearLayers()
        this._unselectPoint()
    }

    _selectPoint(marker) {
        marker.setIcon(marker.options.selectedIcon)
        this._selectedPoint = marker
        this._showList()
    }

    _unselectPoint() {
        this._unselectLocation()

        let marker = this._selectedPoint

        if (marker != undefined) {
            marker.setIcon(marker.options.normalIcon)
            this._selectedPoint = undefined
        }

        this._unshowList()
    }

    _selectLocation(marker) {
        marker.setIcon(this._locationIconSelected)
        this._selectedLocation = marker
    }

    _unselectLocation() {
        let marker = this._selectedLocation

        if (marker != undefined) {
            marker.setIcon(this._locationIcon)
            this._selectedLocation = undefined
        }
    }

    _showList() {
        this._list.style.display = "block"
    }

    _unshowList() {
        this._list.style.display = "none"
    }

    _updateList(point) {
        let list = this._list

        // Set header text
        let header = list.getElementsByClassName("list-header")[0]
        header.innerHTML = "<b>" + point.name + "</b> (" + point.type.capitalize() + ") <br />" + point.description

        // Set locations
        let listEntries = list.getElementsByClassName("list-group")[0]
        listEntries.innerHTML = ""

        point.entries.forEach(function (location) {
            let text = "From <b>" + location.name + "</b> for " + location.ticks + " Ticks <br />" + location.description
            listEntries.insertAdjacentHTML("beforeend", '<button type="button" class="list-group-item list-group-item-action list-group-item-dark active">' + text + '</button>');
        })

        console.log(listEntries)
    }
}
