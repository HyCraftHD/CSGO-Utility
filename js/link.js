function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === "?" ? queryString.substr(1) : queryString).split("&")
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("=")
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "")
    }
    return query
}

function replaceHistory(map) {
    const params = manipulateQuery(window.location.search, map)
    window.history.replaceState("", "", window.location.pathname + "?" + decodeURIComponent(params))
}

function addHistory(map) {
    const params = manipulateQuery(window.location.search, map)
    window.history.pushState("", "", window.location.pathname + "?" + decodeURIComponent(params))
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

function updateQueryParameter(url, key, value) {
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (var i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != key){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + key + "=" + value;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}