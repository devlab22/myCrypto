const crypto = require('crypto');
const fs = require('fs');

class MyCrypt {

    constructor(password = '', salt = '') {

        this.algorithm = 'aes-256-cbc';
        this.key = crypto.scryptSync(password, salt, 32);
        this.iv = Buffer.alloc(16, 0);
    }

    encrypt(message) {
        // Creating cipher
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);

        // Declaring encrypted
        let encrypted = '';

        // Reading data
        cipher.on('readable', () => {
            let chunk;
            while (null !== (chunk = cipher.read())) {
                encrypted += chunk.toString('base64');
            }
        });

        cipher.on('error', () => {
            throw new Error('error')
        })

        // Writing data
        cipher.write(message);
        cipher.end();
        return encrypted;
    }

    decrypt(data) {

        const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);

        let decrypted = '';

        decipher.on('readable', () => {
            let chunk;
            while (null !== (chunk = decipher.read())) {
                decrypted += chunk.toString('utf8');
            }
        })

        decipher.on('error', () => {
            throw new Error('wrong password')
        })

        decipher.write(data, 'base64');
        decipher.end();
        return decrypted;
    }

    encryptToFile(filename, message) {

        try {
            const encrypted = this.encrypt(message);
            fs.writeFileSync(filename, encrypted);
        }
        catch (err) {
            throw new Error(err.message)
        }

    }

    decryptFromFile(filename, toJson = false) {

        try {
            const data = fs.readFileSync(filename, 'utf8');
            const decrypted = this.decrypt(data);
            if (toJson) {
                const decryptedJson = JSON.parse(decrypted);
                return decryptedJson;
            }
            else {
                return decrypted;
            }

        } catch (err) {
            throw new Error(err.message)
        }
    }
}

module.exports = MyCrypt;