class UtilityMap {

    constructor(divMap, divList, divVideo, name) {
        this._name = name

        this._list = document.getElementById(divList)
        this._video = document.getElementById(divVideo)

        this._setupMap(divMap)
        this._setupTypes()
        this._setupLayers()
        this._setupIcons()
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

        marker.point = point

        marker.setIcon(marker.options.normalIcon)

        marker.bindTooltip("<b>" + point.name + "</b>")

        marker.on("click", function (e) {
            self._showLocations(point)
            self._selectPoint(marker)
        })

        marker.addTo(this._types.get(point.type).layer)
    }

    _showLocations(point) {
        let self = this
        let locations = point.entries

        this._showLocationLayer = true
        this._removeLocations()

        locations.forEach(function (location) {
            let marker = L.marker([location.x, location.y], {
                icon: self._locationIcon
            })

            console.log(marker)

            marker.point = point
            marker.location = location

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
        this._updateList(marker.point)
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
        marker._bringToFront()
        this._selectedLocation = marker
       
        this._updateList(marker.point, marker.location)
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

    _updateList(point, selectedLocation = undefined) {
        let self = this
        let list = this._list

        // Clear all stuff from before
        list.innerHTML = ""

        // Set header text
        let header = document.createElement("button");
        header.type = "button"
        header.className = "btn btn-success btn-block"
        header.innerHTML = "<b>" + point.name + "</b> (" + point.type.capitalize() + ") <br />" + point.description

        list.insertAdjacentElement("beforeend", header)


        // Set locations

        let listEntries = document.createElement("div");

        point.entries.forEach(function (location) {
            let selected = location == selectedLocation

            let button = document.createElement("button");
            button.type = "button"
            button.className = "list-group-item list-group-item-action list-group-item-dark" + (selected ? " active" : "")
            button.innerHTML = "From <b>" + location.name + "</b><br />" + location.description
            button.onclick = function() {
                self._locationLayer.eachLayer(function (marker) {
                    if(marker.point == point && marker.location == location) {
                        self._unselectLocation()
                        self._selectLocation(marker)
                    }
                })
            }

            listEntries.insertAdjacentElement("beforeend", button)
        })

        list.insertAdjacentElement("beforeend", listEntries)
    }
}
