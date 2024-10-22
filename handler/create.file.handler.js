const { errorHandler } = require("./error.handler");
const { firebaseApp } = require("../firebase/init.firebase");
const { ref, getDownloadURL, uploadBytesResumable} = require("firebase/storage");
const { createMetadata, Metadata } = require("../auxiliar/metadata.aux");

const createMutipleFiles = (data, response) => {
    const files = [];
    const uploadTaskPromises = [];

    data.map((rawData) => {
        files.push(createMetadata(rawData, Metadata.UPLOAD));
    })

    files.map((file) => {
        const storageRef = ref(firebaseApp.storage, `files/${file.metadata.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file.data, file.metadata);
        const uploadTaskPromise = new Promise((resolve, reject) => {
            uploadFile(uploadTask, resolve, reject);
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
    const uploadTask = uploadBytesResumable(storageRef, file.data, file.metadata);
    uploadFile(uploadTask,
        (downloadURL) => {
            response.status(201).json({"urls" : downloadURL});
        },
        (error) => {
            response.status(501).json({"error" : error});
        }
    );
}

function uploadFile(uploadTask, resolve, reject) {
    uploadTask.on(
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
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
            });
        }
    );
}

module.exports = {
    createSingleFile,
    createMutipleFiles
};