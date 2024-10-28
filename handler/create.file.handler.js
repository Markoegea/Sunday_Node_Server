const { errorHandler } = require("./error.handler");
const { firebaseApp } = require("../firebase/init.firebase");
const { ref, getDownloadURL, uploadBytesResumable, uploadString} = require("firebase/storage");
const { createMetadata, Metadata } = require("../auxiliar/metadata.aux");

const createMutipleFiles = (data, response) => {
    const files = [];
    const uploadTaskPromises = [];

    data.map((rawData) => {
        files.push(createMetadata(rawData, Metadata.UPLOAD));
    })

    files.map((file) => {
        const storageRef = ref(firebaseApp.storage, `files/${file.metadata.name}`);
        const uploadTaskPromise = new Promise((resolve, reject) => {
            uploadFile(storageRef, file.data, file.metadata, resolve, reject);
        });
        uploadTaskPromises.push(uploadTaskPromise);
    });

    Promise.all(uploadTaskPromises).then((downloadURL) => {
        response.status(201).json({"urls" : downloadURL});
    }, (error) => {
        response.status(501).json({"error" : error});
    });
}

const createSingleFile = (data, response) => {
    const file = createMetadata(data, Metadata.UPLOAD);

    const storageRef = ref(firebaseApp.storage, `files/${file.metadata.name}`);
    uploadFile(storageRef, file.data, file.metadata,
        (downloadURL) => {
            response.status(201).json({"urls" : downloadURL});
        },
        (error) => {
            response.status(501).json({"error" : error});
        }
    );
}

function uploadFile(storageRef, data, metadata, resolve, reject) {
    let uploadPromise; 
    if (metadata.contentEncoding  === "base64") {
        uploadPromise = uploadString(storageRef, data, metadata.contentEncoding, metadata);
    } else {
        uploadPromise = uploadBytesResumable(storageRef, data, metadata);
    }
    
    uploadPromise.on(
        "state_changed",
        (snapshot) => {
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log(progress);
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

module.exports = {
    createSingleFile,
    createMutipleFiles
};