const MyCrypt = require('./MyCrypt');

const dirname = process.cwd();
const path = require('path');
const readlineSync = require('readline-sync');


// ============= input console ==========================

console.log('to exit press q');

while (true) {

    var toJson = false;
    var fname = '';

    var password = readlineSync.question("set password:\n");
    if (password === 'q') {
        return;
    }
    var salt = readlineSync.question("set salt:\n");
    if (salt === 'q') {
        return;
    }

    var toDo = readlineSync.question("encrypt: e, decrypt: d\n");
    if (toDo === 'q') {
        return;
    }

    if (toDo === 'd') {

        var jsonStr = readlineSync.question("set to json y/n:\n");
        if (jsonStr === 'q') {
            return;
        }

        if (jsonStr.toLowerCase() === 'y') {
            toJson = true;
        }

    }

    var useFile = readlineSync.question("use File: f, use string other:\n");
    if (filename === 'q') {
        return;
    }

    if (useFile === 'f') {
        var filename = readlineSync.question("filename:\n");
        if (filename === 'q') {
            return;
        }
        fname = path.join(dirname, filename);
    }

    if (!((toDo === 'd') && (useFile === 'f'))) {
        var content = readlineSync.question("content:\n");
        if (content === 'q') {
            return;
        }
    }

    try {

        switch (toDo) {
            case 'e':
                // encrypt
                if (useFile === 'f') {
                    // to file
                    MyCrypt.encryptToFile(fname, content, password, salt);
                }
                else {
                    // from content
                    MyCrypt.encrypt(content, password, salt);
                }

                console.log('done');
                break;
            case 'd':

                var result = '';
                // decrypt
                if (useFile === 'f') {
                    // from file
                    result = MyCrypt.decryptFromFile(fname, password, salt, toJson);
                }
                else {
                    // from content
                    result = MyCrypt.decrypt(content, password, salt, toJson);
                }

                if (toJson) {
                    var jsonPretty = JSON.stringify(result, null, 2);
                    console.log(jsonPretty)
                }
                else {
                    console.log(result)
                }

                break;
            default:
                console.log('unknown operation');
        }

    }
    catch (err) {
        console.log(err.message)
    }

    var quit = readlineSync.question("to exit press q:\n");
    if(quit === 'q'){
        return;
    }

}


