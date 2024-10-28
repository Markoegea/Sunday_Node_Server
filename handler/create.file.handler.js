const { errorHandler } = require("./error.handler");
const { firebaseApp } = require("../firebase/init.firebase");
const { ref } = require("firebase/storage");
const { createMetadata, Metadata } = require("../auxiliar/metadata.aux");
const { ByteEncoding } = require("./create_chain/byteEncoding.file.chain");
const { Base64Encoding } = require("./create_chain/base64Encoding.file.chain");

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
    const uploadChain = new Base64Encoding().setNextHandler(new ByteEncoding());
    uploadChain.handle(storageRef, data, metadata, resolve, reject);
}

module.exports = {
    createSingleFile,
    createMutipleFiles
};