
const
    path = getParameterByName("path") || "/",
    domain = window.location.href.split("/")[2],
    rdomain = `http${domain == "localhost" ? "" : "s"}://${domain}`;
document.getElementById('domain').innerHTML = domain + ".";
(async () => {
    const
        elError = document.getElementById('error'),
        main = document.getElementById("main"),
        ip = await getIp(),
        agent = window.navigator.userAgent,
        xhr = new XMLHttpRequest();
    await setCookie("ip", ip);
    xhr.addEventListener("loadend", async () => {
        const { type, id, humain, check1, check2 } = JSON.parse(xhr.response);
        if (type === 0 || type === 1 || type === 2) {
            main.style.display = "none";
            document.querySelector("form input[type='hidden']#id").value = id;
            document.querySelector("form input[type='hidden']#path").value = path;
            document.querySelector("form input[type='hidden']#ip").value = ip;
            document.querySelector("form input[type='hidden']#agent").value = agent;
            elError.style.display = "block";
        }
        else if (type === -1) {
            await setCookie("die", JSON.stringify(xhr.response));
            document.body.style.padding = "20px";
            document.body.innerHTML = "<h1>404 Not Found</h1>The page that you have requested could not be found.";
        } else if (type === 3) {
            await setCookie("id", id);
            window.location.href = `${path}?id=${id}` || `?id=${id}`;
        }
    });
    xhr.open("POST", "/verification");
    xhr.setRequestHeader("Content-Type", "application/json"); // set Content-Type header
    xhr.send(JSON.stringify({ ip, agent }));

    function getIp() {
        return new Promise(resolve => {
            const request = new XMLHttpRequest();
            request.open('GET', `https://api.ipify.org?format=json`, true);
            request.responseType = 'json';
            request.onload = () => resolve(request.status === 200 ? request?.response?.ip : false);
            request.send();
        })
    }

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

})();
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}