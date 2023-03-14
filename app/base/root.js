module.exports = {
    path: "/",
    method: "GET",
    protection: true,
    go: (db, req, res) => {
        res.sendFile("root.html", { root: "./public" })
    }
}