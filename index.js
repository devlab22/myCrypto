const MyCrypt = require('./MyCrypt');
const { ArgumentParser } = require('argparse');

const dirname = process.cwd();
const path = require('path');

// === argparse ===

const parser = new ArgumentParser({ description: 'Argparse crypto' });

parser.add_argument('-password', '--password', { help: 'password', required: true });
parser.add_argument('-salt', '--salt', { help: 'salt', required: false });
parser.add_argument('-action', '--action', { help: 'encrypt/decript', required: true });
parser.add_argument('-toJson', '--toJson', { help: 'convert output to JSON', action: 'store_true' });
parser.add_argument('-show', '--show', { help: 'show encrypted', action: 'store_true' });
parser.add_argument('-src', '--src', { help: 'source filename' });
parser.add_argument('-target', '--target', { help: 'target filename' });
parser.add_argument('-content', '--content', { help: 'content' });


const args = parser.parse_args();

function processParse() {

    var password = '';
    var salt = '';
    var action = '';
    var toJson = false;
    var content = '';
    var show = false;
    var result = '';
    var srcFilename = null;
    var targetFname = null;

    console.log('input data:');
    console.dir(args);
    console.log('version v1.0, build: 20230328');
    console.log('output data:')

    if (args.src){
        srcFilename = path.join(dirname, args.src);
    }

    if(args.target){
        targetFname = path.join(dirname, args.target)
    }

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

    if (args.content) {
        content = args.content
    }

    try {

        switch (action) {
            case 'encrypt':
                // encrypt
                if ((targetFname) && (srcFilename === null)) {
                    result = MyCrypt.encryptToFile(targetFname, content, password, salt);
                }
                else if ((targetFname) && (srcFilename)){
                    result = MyCrypt.encryptFromFileToFile(password, salt, srcFilename, targetFname);
                }
                else {
                    result = MyCrypt.encrypt(content, password, salt)
                }

                if (show) {
                    console.log(result)
                }

                console.log('done');
                break;
            case 'decrypt':
                // decrypt

                if((targetFname === null) && (srcFilename)) {
                    result = MyCrypt.decryptFromFile(srcFilename, password, salt, toJson);
                }
                else if ((targetFname) && (srcFilename)){
                    result = MyCrypt.decryptFromFileToFile(password, salt, srcFilename, targetFname, toJson);
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
}

processParse();




