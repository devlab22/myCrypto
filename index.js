const MyCrypt = require('./MyCrypt');

const dirname = process.cwd();
const path = require('path');
const readlineSync = require('readline-sync')


function decryptFromFile(fname, password = '', salt = '', toJson = false) {

    const filename = path.join(dirname, fname)

    try {

        const crypter = new MyCrypt(password, salt);
        const decryptedText = crypter.decryptFromFile(filename, toJson);
        console.log(decryptedText);

    }
    catch (err) {
        console.log('Error by decrypt')
        // console.log(err.message)
    }
}

function decrypt(content, password = '', salt = '', toJson = false) {

    try {

        const crypter = new MyCrypt(password, salt);
        const decrypted = crypter.decrypt(content, toJson)
        console.log(decrypted);

    }
    catch (err) {
        console.log('Error by decrypt')
        // console.log(err.message)
    }

}

function encryptToFile(fname, content = '', password = '', salt = '') {

    const filename = path.join(dirname, fname);

    try {
        const crypter = new MyCrypt(password, salt);
        crypter.encryptToFile(filename, content);
    }
    catch (err) {
        console.log('Error by encrypt');
    }
    finally {
        console.log('done');
    }
}

function encrypt(content = '', password = '', salt = ''){

    try {
        const crypter = new MyCrypt(password, salt);
        crypter.encrypt(content);
    }
    catch (err) {
        console.log('Error by encrypt');
    }
    finally {
        console.log('done');
    }

}

function encryptData() {
    // === encrypt ===
    var data = {
        apiKey: '!mytest123',
        networkId: 'L_99999999999'
    }

    const content = JSON.stringify(data);

    encryptToFile('vengelhard.ini', content, '!Secret22', 'Cisco');

}

// ============= input console ==========================

//encryptData()
//decrypt('vengelhard.ini', '!Secret22', 'Cisco', true);

console.log('to exit press q')

var toJson = false;
var password = readlineSync.question("set password\n")
if (password === 'q') {
    return
}
var salt = readlineSync.question("set salt\n")
if (salt === 'q') {
    return
}

var toDo = readlineSync.question("encrypt: e, decrypt: d\n")
if (toDo === 'q') {
    return
}

var useFile = readlineSync.question("from File: f, from string other\n")
if (filename === 'q') {
    return
}

if (useFile === 'f') {
    var filename = readlineSync.question("set filename\n")
    if (filename === 'q') {
        return
    }
}
else {
    var content = readlineSync.question("set content\n")
    if (content === 'q') {
        return
    }
}

var jsonStr = readlineSync.question("set to json y/n\n")
if (jsonStr === 'q') {
    return
}

if (jsonStr.toLowerCase() === 'y') {
    toJson = true
}


switch (toDo){
    case 'e':
        // encrypt
        if(useFile === 'f'){
            // to file
            encryptToFile(filename, content, password, salt)
        }
        else{
            // from content
            encrypt(content, password, salt)
        }
        
        break;
    case 'd':
        // decrypt
        if(useFile === 'f'){
            // from file
            decryptFromFile(filename,password,salt,toJson)
        }
        else{
            // from content
            decrypt(content, password, salt, toJson)
        }
        break;
    default:
        console.log('unknown operation')
}



