const {Encoding} = require("./encoding.file.chain");
const {getDownloadURL, uploadString} = require("firebase/storage");

class Base64Encoding extends Encoding {
    handle(storageRef, data, metadata, resolve, reject) {
        if (metadata.contentEncoding  === "base64") {
            const uploadPromise = uploadString(storageRef, data, metadata.contentEncoding, metadata);
            uploadPromise.then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            });
            return uploadPromise;
        }
        return this.handleNext(storageRef, data, metadata, resolve, reject)
    }
}

module.exports = {
    Base64Encoding
}