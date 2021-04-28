function replaceHistory(map) {
    const params = manipulateQuery(window.location.search, map)
    window.history.replaceState("", "", window.location.pathname + "?" + decodeURIComponent(params))
}

function addHistory(map) {
    const params = manipulateQuery(window.location.search, map)
    window.history.pushState("", "", window.location.pathname + "?" + decodeURIComponent(params))
}

function parseQuery(query) {
    const params = new URLSearchParams(query)
    const queryObject = {}

    for (const entry of params.entries()) {
        queryObject[decodeURIComponent(entry[0])] = decodeURIComponent(entry[1] || "")
    }

    return queryObject
}

function manipulateQuery(query, map) {
    const params = new URLSearchParams(query)

    for (const key in map) {
        const value = map[key]
        if(value == null) {
            params.delete(key)
        } else {
            params.set(key, value)
        }
    }

    return params
}