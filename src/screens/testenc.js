const crypto = require('../../crypto-custom.js');



const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
	modulusLength: 2048,
	publicKeyEncoding: {
	  type: "pkcs1",
	  format: "pem",
	},
	privateKeyEncoding: {
	  type: "pkcs1",
	  format: "pem",
	},
  });
/*
const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
	namedCurve: 'sect239k1',
  });
  */




// This is the data we want to encrypt
const data = "my secret data";

const encryptedData = crypto.publicEncrypt(
  {
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  },
  // We convert the data string to a buffer using `Buffer.from`
  Buffer.from(data)
);

// The encrypted data is in the form of bytes, so we print it in base64 format
// so that it's displayed in a more readable form
console.log("encypted data: ", encryptedData.toString("base64"));

/*
console.log("printing type of enc data")
console.log( encryptedData)*/

const test1 = encryptedData.toString("base64")
const test1buffer = Buffer.from(test1,'base64')
const test2 = test1buffer.toString('base64')

console.log("is it equal strings ")
console.log(test2 === test2)
console.log(encryptedData.length) 


const decryptedData = crypto.privateDecrypt(
	{
	  key: privateKey,
	  // In order to decrypt the data, we need to specify the
	  // same hashing function and padding scheme that we used to
	  // encrypt the data in the previous step
	  padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
	  oaepHash: "sha256",
	},
	test1buffer
  );
  
  // The decrypted data is of the Buffer type, which we can convert to a
  // string to reveal the original data
  console.log("decrypted data: ", decryptedData.toString());
  


  function GenerateKeys(){

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
      });

      

    return { publicKey, privateKey }
  }


  export {GenerateKeys} 