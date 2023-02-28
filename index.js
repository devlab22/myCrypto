const MyCrypt = require('./MyCrypt');
const readlineSync = require('readline-sync');
const { ArgumentParser } = require('argparse');
const { version } = require('./package.json');

const dirname = process.cwd();
const path = require('path');

// === argparse ===

var password = '';
var salt = '';
var action = '';
var toJson = false;
var filename = null;
var content = '';
var show = false;
var result = '';

const parser = new ArgumentParser({ description: 'Argparse crypto' })

parser.add_argument('-v', '--version', { action: 'version', version })
parser.add_argument('-password', '--password', { help: 'password', required: false })
parser.add_argument('-salt', '--salt', { help: 'salt', required: false })
parser.add_argument('-action', '--action', { help: 'e -> encrypt/ d -> decript', required: false })
parser.add_argument('-toJson', '--toJson', { help: 'convert output to JSON', action: 'store_true' })
parser.add_argument('-show', '--show', { help: 'show encrypted', action: 'store_true' })
parser.add_argument('-filename', '--filename', { help: 'filname' })
parser.add_argument('-content', '--content', { help: 'content' })

const args = parser.parse_args();


if (args.password !== undefined) {
    console.dir(args);

    if (args.password) {
        password = args.password
    }

    if (args.salt) {
        salt = args.salt;
    }

    if (args.action) {
        action = args.action;
    }

    if (args.toJson) {
        toJson = args.toJson;
    }

    if (args.show) {
        show = args.show;
    }

    if (args.filename) {
        filename = path.join(dirname, args.filename);
    }

    if (args.content) {
        content = args.content
    }

    try {

        switch (action) {
            case 'e':
                // encrypt
                if (filename) {
                    result = MyCrypt.encryptToFile(filename, content, password, salt);
                }
                else {
                    result = MyCrypt.encrypt(content, password, salt)
                }

                if (show) {
                    console.log(result)
                }

                console.log('done');
                break;
            case 'd':
                // decrypt

                if (filename) {
                    result = MyCrypt.decryptFromFile(filename, password, salt, toJson);
                }
                else {
                    result = MyCrypt.decrypt(content, password, salt, toJson);
                }

                if (toJson) {
                    var jsonPretty = JSON.stringify(result, null, 2);
                    console.log(jsonPretty);
                }
                else {
                    console.log(result);
                }
                break;
            default:
                console.log('unsupported action');
        }
    }
    catch (err) {
        console.error(err.message)
    }


    return;
}

// ============= input console ==========================

console.log('to exit press q');

while (true) {

    var fname = '';

    password = readlineSync.question("set password:\n");
    if (password === 'q') {
        return;
    }

    salt = readlineSync.question("set salt:\n");
    if (salt === 'q') {
        return;
    }

    action = readlineSync.question("encrypt: e, decrypt: d\n");
    if (action === 'q') {
        return;
    }

    if (action === 'd') {

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
        filename = readlineSync.question("filename:\n");
        if (filename === 'q') {
            return;
        }
        fname = path.join(dirname, filename);
    }

    if (!((action === 'd') && (useFile === 'f'))) {
        var content = readlineSync.question("content:\n");
        if (content === 'q') {
            return;
        }
    }

    try {

        switch (action) {
            case 'e':
                // encrypt
                if (useFile === 'f') {
                    // to file
                    result = MyCrypt.encryptToFile(fname, content, password, salt);
                }
                else {
                    // from content
                    result = MyCrypt.encrypt(content, password, salt);
                }

                show = readlineSync.question('show encrypted? y/n\n')
                if (show === 'y') {
                    console.log(result)
                }
                console.log('done');
                break;
            case 'd':
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
                    console.log(jsonPretty);
                }
                else {
                    console.log(result);
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
    if (quit === 'q') {
        return;
    }

}


