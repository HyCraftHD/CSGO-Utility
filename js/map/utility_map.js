class UtilityMap {

    constructor(divMap, divList, divVideo) {
        this._list = document.getElementById(divList)
        this._video = document.getElementById(divVideo)

        this._setupMap(divMap)
        this._setupTypes()
        this._setupLayers()
        this._setupIcons()
        this._setupVideoPlayer()
    }

    async loadMap(name) {
        let self = this

        // Clear map
        self._types.get("smoke").layer.clearLayers()
        self._types.get("molotov").layer.clearLayers()
        self._types.get("flash").layer.clearLayers()
        self._unshowLocations()
        self._unshowList()
        self._unshowPlayer()

        // Load new map data
        self._backgroundImage.setUrl("./assets/img/" + name + "_map.png")

        let files = await (await fetch("./api/maps/" + name + "/load.json")).json()

        await Promise.all(files.map(async (file) => {
            let point = await (await fetch("./api/maps/" + name + "/" + file)).json()
            // Set the file name as a property
            point.file = file
            self._addPoint(point)
        }));
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
        addHistory({type: marker.point.type, file: marker.point.file})

        marker.setIcon(marker.options.selectedIcon)
        this._selectedPoint = marker
        this._updateList(marker.point)
        this._showList()
    }

    _unselectPoint() {
        this._unselectLocation()

        addHistory({type: null, file: null})

        let marker = this._selectedPoint

        if (marker != undefined) {
            marker.setIcon(marker.options.normalIcon)
            this._selectedPoint = undefined
        }

        this._unshowList()
    }

    _selectLocation(marker, ticks = undefined) {
        addHistory({entry: marker.location.name})

        marker.setIcon(this._locationIconSelected)
        marker._bringToFront()
        this._selectedLocation = marker
       
        this._updateList(marker.point, marker.location)
        this._updateVideo(marker.location, ticks)
        this._showPlayer()
    }

    _unselectLocation() {
        addHistory({entry: null})

        let marker = this._selectedLocation

        if (marker != undefined) {
            marker.setIcon(this._locationIcon)
            this._selectedLocation = undefined
        }

        this._unshowPlayer()
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

            let button = document.createElement("button")
            button.type = "button"
            button.className = "list-group-item list-group-item-action list-group-item-dark" + (selected ? " active" : "")

            let content = document.createElement("div")
            content.className = "d-flex justify-content-between"

            let text = document.createElement("span")
            text.innerHTML = "From <b>" + location.name + "</b><br />" + location.description
            content.insertAdjacentElement("beforeend", text)

            let tickList = document.createElement("span")

            location.videos.sort((a, b) => {
                let tickA = String(a.ticks)
                let tickB = String(b.ticks)

                if(isNaN(parseFloat(tickA))) {
                    return -1;
                } else if(isNaN(parseFloat(tickB))) {
                    return 1;
                } else {
                    return tickB - tickA
                }
            })

            location.videos.forEach(function (video) {
                let tick = document.createElement("span")

                let ticks = Number(video.ticks)
                let badge = "bg-success"

                if(ticks == 128) {
                    badge = "bg-danger"
                } else if (ticks == 64) {
                    badge = "bg-warning"
                }

                tick.className = "badge float-right " + badge
                tick.innerHTML = video.ticks + " Ticks"
                tick.onclick = function(event) {
                    event.stopPropagation()
                    self._locationLayer.eachLayer(function (marker) {
                        if(marker.point == point && marker.location == location) {
                            self._unselectLocation()
                            self._selectLocation(marker, video.ticks)
                        }
                    })
                }

                tickList.insertAdjacentElement("beforeend", tick)

                let lineBreak = document.createElement("br")
                tickList.insertAdjacentElement("beforeend", lineBreak)
            })
            content.insertAdjacentElement("beforeend", tickList)

            button.insertAdjacentElement("beforeend", content)

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

    _updateVideo(location, ticks = undefined) {
        let player = this._player

        if(player != undefined && typeof(player.pauseVideo) == "function") {
            let selectedVideo = undefined

            if(ticks != undefined) {
                location.videos.forEach(function (video) {
                    if(String(video.ticks) === String(ticks)) {
                        selectedVideo = video
                    }
                })
            }

            if(selectedVideo == undefined) {
                location.videos.sort((a, b) => {
                    let tickA = String(a.ticks)
                    let tickB = String(b.ticks)
    
                    if(isNaN(parseFloat(tickA))) {
                        return -1;
                    } else if(isNaN(parseFloat(tickB))) {
                        return 1;
                    } else {
                        return tickB - tickA
                    }
                })

                selectedVideo = location.videos[0]
            }

            let iframe = player.getIframe()
            iframe.style.border = "solid 10px"
            
            let selectedTicks = Number(selectedVideo.ticks)
            let color = "#5cb85c"

            if(selectedTicks == 128) {
                color = "#d9534f"
            } else if(selectedTicks == 64) {
                color = "#f0ad4e"
            }
            iframe.style.borderColor = color
            
            player.loadVideoById(selectedVideo.youtube)
        } else {
            console.log("Video could not be loaded")
        }
    }

    _showPlayer() {
        this._video.style.display = "block"
    }

    _unshowPlayer() {
        this._video.style.display = "none"

        let player = this._player
        if(player != undefined && typeof(player.pauseVideo) == "function") {
            player.pauseVideo()
        }
    }
}
