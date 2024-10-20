const { errorHandler } = require("../handler/error.handler");
const { firebaseApp } = require("../firebase/init.firebase");
const { ref, getDownloadURL, getMetadata, listAll, list} = require("firebase/storage");


const readSingleFile = (location, response) => {
    const fileRef = ref(firebaseApp.storage, location);

    listFiles(fileRef, false).then((directory) => {
        response.status(201).json(directory);
    })
}

const readMultipleFiles = (response) => {
    const fileRef = ref(firebaseApp.storage);

    listFiles(fileRef).then((directory) => {
        response.status(201).json(directory);
    })
}

async function listFiles(locationRef, deepSearch=true) {
    const directory = {};
    const subDirectory = [];
    
    const directoryList = await listAll(locationRef);
    directoryList.items.forEach((itemRef) => {
        // All the items under listRef.
        subDirectory.push(itemRef.name);
    });

    for (let i = 0; i < directoryList.prefixes.length; i++) {
        const folderRef = directoryList.prefixes[i];
        if (deepSearch) {
            const subFolder = await listFiles(folderRef);
            Object.assign(directory, subFolder);
        } else {
            subDirectory.push(folderRef.fullPath);
        }
    }

    directory[locationRef.fullPath] = subDirectory;
    return directory;
}

module.exports = {
    readSingleFile,
    readMultipleFiles
};