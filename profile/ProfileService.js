const rp = require('request-promise');

async function getMySkins(token) {
    var url = 'http://trilha-ies.herokuapp.com/store/'
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

async function equipSkin(token, id) {
    var url = 'http://trilha-ies.herokuapp.com/store/equip/' + id
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

module.exports.getMySkins = getMySkins
module.exports.equipSkin = equipSkin