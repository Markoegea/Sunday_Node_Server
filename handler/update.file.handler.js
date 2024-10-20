const { errorHandler } = require("./error.handler");
const { firebaseApp } = require("../firebase/init.firebase");
const { ref, updateMetadata} = require("firebase/storage");
const { createMetadata, Metadata } = require("../auxiliar/metadata.aux");

const updateMutipleFiles = (data, response) => {
    const newMetadataArray = [];
    const updateTaskPromises = [];

    data.map((rawData) => {
        newMetadataArray.push(createMetadata(rawData, Metadata.UPDATE));
    })

    newMetadataArray.map((newMetadata) => {
        const storageRef = ref(firebaseApp.storage, `files/${newMetadata.name}`);

        const updateTaskPromise = new Promise((resolve, reject) => {
            updateFile(storageRef, newMetadata, resolve, reject);
        });
        updateTaskPromises.push(updateTaskPromise);
    });

    Promise.all(updateTaskPromises).then((storageRef, metadata) => {
        response.status(201).json({message : `Files ${storageRef.map((files) => files.name)} has been updated successfully.`});
    }, (error) => {
        response.status(501).json({error : error});
    });
}

const updateSingleFile = (data, response) => {
    const newMetadata = createMetadata(data, Metadata.UPDATE);
    const storageRef = ref(firebaseApp.storage, `files/${newMetadata.name}`);
    updateFile(storageRef, newMetadata,
        (storageRef, metadata) => {
            response.status(201).json({message : `File ${storageRef.name} has been updated successfully.`});
        },
        (error) => {
            response.status(501).json({error : error});
        }
    );
}

function updateFile(storageRef, newMetadata, resolve, reject) {
    updateMetadata(storageRef, newMetadata)
    .then((metadata) => {
        resolve(storageRef, metadata);
    })
    .catch((error) => {
        reject(error);
    })
}

module.exports = {
    updateMutipleFiles,
    updateSingleFile
}