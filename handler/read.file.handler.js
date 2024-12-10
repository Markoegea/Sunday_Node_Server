const { errorHandler } = require("../handler/error.handler");
const { firebaseApp } = require("../firebase/init.firebase");
const { ref, getDownloadURL, getMetadata, listAll} = require("firebase/storage");


const readSingleFile = (location, response) => {
    const fileRef = ref(firebaseApp.storage, location);

    checkIfFileOrFolder(fileRef).then((metadata) => {
        response.status(201).json({"metadata" : metadata});
    }).catch((_) => {
        listFiles(fileRef, false).then((directory) => {
            response.status(201).json({"read" : directory});
        }).catch((error) => {
            response.status(201).json({"error" : error});
        });
    });
}

const readMultipleFiles = (response) => {
    const fileRef = ref(firebaseApp.storage);

    listFiles(fileRef).then((directory) => {
        response.status(201).json({"read" : directory});
    }).catch((error) => {
        response.status(201).json({"error" : error});
    });
}

function checkIfFileOrFolder(locationRef) {
    return new Promise((resolve, reject) => {
        getMetadata(locationRef)
        .then((metadata) => resolve(metadata))
        .catch((error) => reject(error));
    });
}

function listFiles(locationRef, deepSearch=true) {
    async function listFilesPromise(locationRef, deepSearch, resolve, reject) {
        try {
            const directory = {};
            const subDirectory = {};
            
            const directoryList = await listAll(locationRef);

            const linksPromises = []
            for (let i = 0; i < directoryList.items.length; i++) {
                const itemRef = directoryList.items[i];

                // All the items under listRef.
                linksPromises.push(
                    new Promise (async (resolve) => {
                        subDirectory[itemRef.name] = await getDownloadURL(itemRef);
                        resolve();
                    })
                )
            } 
        
            const subFolderPromises = [];
            // All folders under listRef.
            for (let i = 0; i < directoryList.prefixes.length; i++) {
                const folderRef = directoryList.prefixes[i];
                if (deepSearch) {
                    subFolderPromises.push (
                        new Promise( async (resolve) => { 
                            const subFolder = await listFiles(folderRef);
                            Object.assign(subDirectory, subFolder);
                            resolve();
                        })
                    );
                    continue;
                }
                subDirectory[folderRef.name] = {};
            }
        
            
            
            await Promise.all(linksPromises);
            await Promise.all(subFolderPromises);
            directory[locationRef.fullPath] = subDirectory;
            resolve(directory);
        } catch (error) {
            reject(error.toString());
        }
    }
    return new Promise((resolve, reject) => listFilesPromise(locationRef, deepSearch, resolve, reject));
}


module.exports = {
    readSingleFile,
    readMultipleFiles
};