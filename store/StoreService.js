const rp = require('request-promise');

async function getCatalog(token, categoryName) {
    var url = 'http://trilha-ies.herokuapp.com/store/catalog'
    if(categoryName != null) {
        url = url + "?category=" + categoryName
    }
    var options = {
        'method': 'GET',
        'url': url,
        'headers':  {
            'Authorization': 'Bearer ' + token
        }
    };

    var res = rp(options).promise();
    return res
}

async function buySkin(token, id) {
    var url = 'http://trilha-ies.herokuapp.com/store/' + id
    var options = {
        'method': 'POST',
        'url': url,
        'headers':  {
            'Authorization': 'Bearer ' + token
        }
    };

    var res = rp(options).promise();
    return res
}

module.exports.getCatalog = getCatalog
module.exports.buySkin = buySkin