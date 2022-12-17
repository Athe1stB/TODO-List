function getDate() {
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    return today.toLocaleDateString("en-US", options);
}
exports.getDate = getDate;

function getTime() {
    let today = new Date();

    let options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }

    return today.toLocaleDateString("en-US", options);
}
exports.getTime = getTime;