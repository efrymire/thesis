const fs = require('fs');
const _ = require('lodash');

var path = 'test.json';

fs.readFile(path, (err, data) => {
    // console.log(data)

    let json = JSON.parse(data)

    let grouped = _.chain(json)
        .groupBy('cluster')
        .map( (val, key) => {
            return {"cluster": key,
                "children": val}
    }).value()

    // let new = []

//     for (var key in grouped) {
//         new
//         console.log('key:', key)
// }

    var arr = {"cluster": "big",
                "children": grouped};
    console.log(arr)

    fs.writeFileSync('jsonpacking.json', JSON.stringify(arr, null, 2))


})