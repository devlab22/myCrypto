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
            encrypted = null;
        })

        // Writing data
        cipher.write(message);
        cipher.end();

        if(encrypted === null){
            throw new Error('error by encrypt')
        }
        return encrypted;
    }

    decrypt(data, toJson=false) {

        const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);

        let decrypted = '';

        decipher.on('readable', () => {
            let chunk;
            while (null !== (chunk = decipher.read())) {
                decrypted += chunk.toString('utf8');
            }
        })

        decipher.on('error', () => {
            decrypted = null;
        })

        decipher.write(data, 'base64');
        decipher.end();

        if(decrypted === null){
            throw new Error('wrong password')
        }

        if(toJson){
            const decryptedJson = JSON.parse(decrypted);
            return decryptedJson;
        }
        else{
            return decrypted;
        }
        
    }

    encryptToFile(filename, message) {

        try {
            const encrypted = this.encrypt(message);
            fs.writeFileSync(filename, encrypted);
            return encrypted;
        }
        catch (err) {
            throw new Error(err.message);
        }

    }

    encryptFromFileToFile(srcFname, targetFname){

        try{

            const text = fs.readFileSync(srcFname, 'utf8');
            const encrypted = this.encryptToFile(targetFname, text);
            return encrypted;
        }
        catch(err){
            throw new Error(err.message)
        }
    }

    decryptFromFile(filename, toJson = false) {

        try {
            const data = fs.readFileSync(filename, 'utf8');
            const decrypted = this.decrypt(data, toJson);
            return decrypted; 

        } catch (err) {
            throw new Error(err.message);
        }
    }

    decryptFromFileToFile(srcFname, targetFname, toJson=false ){

        try{
            const decrypted = this.decryptFromFile(srcFname);
            fs.writeFileSync(targetFname, decrypted);

            if(toJson){
                return JSON.parse(decrypted)
            }
            else{               
                return decrypted;
            }
           
        }
        catch(err){
            throw new Error(err.message)
        }
    }

    // ======= static =========
    static decryptFromFile(fname, password = '', salt = '', toJson = false) {
    
        try {
    
            const crypter = new MyCrypt(password, salt);
            const decryptedText = crypter.decryptFromFile(fname, toJson);
            return decryptedText;
        }
        catch (err) {
            throw new Error(err.message);
        }
    }

    static decrypt(content, password = '', salt = '', toJson = false) {

        try {
    
            const crypter = new MyCrypt(password, salt);
            const decrypted = crypter.decrypt(content, toJson);
            return decrypted;
    
        }
        catch (err) {
            throw new Error(err.message);
        }
    
    }

    static decryptFromFileToFile(password='', salt='', srcFname, targetFname, toJson=false ){

        try{
            const crypter = new MyCrypt(password, salt);
            const decrypted = crypter.decryptFromFileToFile(srcFname, targetFname, toJson);
            return decrypted;
        }
        catch(err){
            throw new Error(err.message)
        }
    }

    static encryptToFile(fname, content = '', password = '', salt = '') {
    
        try {
            const crypter = new MyCrypt(password, salt);
            const encrypted = crypter.encryptToFile(fname, content);
            return encrypted;
        }
        catch (err) {
            throw new Error(err.message);
        }
       
    }

    static encryptFromFileToFile(password='', salt='', srcFname, targetFname){

        try{
            const crypter = new MyCrypt(password, salt);
            const encrypted = crypter.encryptFromFileToFile(srcFname, targetFname);
            return encrypted;
        }
        catch(err){
            throw new Error(err.message)
        }
    }

    static encrypt(content = '', password = '', salt = '') {

        try {
            const crypter = new MyCrypt(password, salt);
            const encrypted = crypter.encrypt(content);
            return encrypted;
        }
        catch (err) {
            throw new Error(err.message);
        }
    
    }
}

module.exports = MyCrypt;