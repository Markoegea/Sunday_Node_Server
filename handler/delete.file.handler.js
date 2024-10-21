const { errorHandler } = require("./error.handler");
const { firebaseApp } = require("../firebase/init.firebase");
const { ref, deleteObject} = require("firebase/storage");

const deleteMutipleFiles = (locations, response) => {
    const deleteTaskPromises = [];

    locations.map((location) => {
        const deleteTaskPromise = new Promise((resolve, reject) => {
            deleteFileTask(location, resolve, reject);
        });
        deleteTaskPromises.push(deleteTaskPromise);
    });

    Promise.all(deleteTaskPromises).then((message) => {
        response.status(201).json({'message' : message});
    }, (error) => {
        response.status(501).json({"error" : error});
    });
}

const deleteSingleFile = (location, response) => {
    deleteFileTask(location,
        (message) => {
            response.status(201).json({'message' : message});
        },
        (error) => {
            response.status(501).json({"error" : error});
        }
    );
}

function deleteFileTask(location, resolve, reject) {
    const storageRef = ref(firebaseApp.storage, location);
    const deletePromise = deleteObject(storageRef).then(() => {
        resolve(`File ${storageRef.name} deleted successfully`);
    }).catch((error) => {
        reject(error);
    });
    return deletePromise;
}

module.exports = {
    deleteMutipleFiles,
    deleteSingleFile
}