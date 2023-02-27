const MyCrypt = require('./MyCrypt');
const dirname = process.cwd();
const path = require('path');

function decrypt(fname, password = '', salt = '', toJson=false) {

    const filename = path.join(dirname, fname)

    try {

        const crypter = new MyCrypt(password, salt)
        const decryptedText = crypter.decryptFromFile(filename);

        if(toJson){
            const decryptedJson = JSON.parse(decryptedText);
            return decryptedJson;
        }
        else{
            return decryptedText;
        }
        
    }
    catch (err) {
         console.log('Error by decrypt')
         console.log(err.message)
    }
}

function encrypt(fname, content = '', password = '', salt = '') {

    const crypter = new MyCrypt(password, salt);
    const filename = path.join(dirname, fname);

    try {

        crypter.encryptToFile(filename, content);
    }
    catch (err) {
        console.log('Error by encrypt')
        console.log(err.message)
    }
    finally{
        console.log('done')
    }
}

function encryptData() {
    // === encrypt ===
    var data = {
        apiKey: '!mytest1234',
        networkId: 'L_99999999999'
    }

    const content = JSON.stringify(data)

    encrypt('vengelhard.ini', content, '!Secret22', 'Cisco');

}



console.log(decrypt('vengelhard.ini', '!Secret22', 'Cisco', true))



