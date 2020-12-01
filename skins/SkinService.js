const rp = require('request-promise');

async function getSkins(categoryName) {
    var url = 'https://trilha-ies.herokuapp.com/skin'
    if(categoryName != null) {
        url = url + "?category=" + categoryName
    }
    var options = {
        'method': 'GET',
        'url': url
    };

    var res = rp(options).promise();
    return res
}

module.exports.getSkins = getSkins