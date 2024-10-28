const {Encoding} = require("./encoding.file.chain");
const { getDownloadURL, uploadBytesResumable} = require("firebase/storage");

class ByteEncoding extends Encoding {
    handle(storageRef, data, metadata, resolve, reject) {
        if (metadata.contentEncoding  === "7bit") {
            const uploadPromise = uploadBytesResumable(storageRef, data, metadata);
            uploadPromise.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                },
                (error) => {
                    errorHandler(error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadPromise.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
            return uploadPromise;
        }
        return this.handleNext(storageRef, data, metadata)
    }
}

module.exports = {
    ByteEncoding
}