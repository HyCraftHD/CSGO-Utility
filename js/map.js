class Map {
    constructor(div, name) {
        var bounds = [[0, 0], [800, 800]]

        var map = L.map(div, {
            crs: L.CRS.Simple,
            attributionControl: false
        })

        L.imageOverlay("./assets/img/" + name + "_map.png", bounds).addTo(map)

        map.setView([400, 400], 0)

        map.setMaxBounds(bounds)
        map.on("drag", function () {
            map.panInsideBounds(bounds, {
                animate: false
            })
        })

        map.fitBounds(bounds)

        map.on("contextmenu", function (event) {
            alert("Map Coordinates are: " + event.latlng.toString())
        })

        map.doubleClickZoom.disable()

        let object = this
        map.on("click", function (e) {
            object.clearTmpPoints()
        })

        this.name = name
        this.map = map
        this.tmpMarkers = []
    }
    async loadPoints() {
        let object = this
        let name = this.name

        let files = await (await fetch("./assets/json/" + name + "/load.json")).json()

        files.forEach(async function (file) {
            let json = await (await fetch("./assets/json/" + name + "/" + file)).json()

            object.addPoint(json)
        })
    }
    clearTmpPoints() {
        if (this.tmpMarkers.length != 0) {
            this.tmpMarkers.forEach(function (locMarker) {
                console.log(this)
                this.map.removeLayer(locMarker)
            })
            this.tmpMarkers.splice(0, this.tmpMarkers.length)
            return true
        }
        return false
    }
    addPoint(point) {
        let object = this
        let map = this.map

        var smoke = new L.Icon({
            iconUrl: "./assets/img/smoke.png",
            iconSize: [30, 30]
        })

        let marker = L.marker([point.x, point.y], {
            icon: smoke,
            locations: point.entries
        })

        marker.bindTooltip(point.name, {
            permanent: false
        })

        marker.on("click", function (e) {
            if (!object.clearTmpPoints()) {
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
                    object.tmpMarkers.push(locMarker)
                })
            }
        })
        marker.addTo(map)
    }
    getMap() {
        return this.map
    }
}
