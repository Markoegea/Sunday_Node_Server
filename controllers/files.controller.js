const { createMutipleFiles, createSingleFile } = require('../handler/create.file.handler');
const { readSingleFile, readMultipleFiles } = require('../handler/read.file.handler');
const { updateMutipleFiles, updateSingleFile } = require('../handler/update.file.handler');
const { deleteMutipleFiles, deleteSingleFile } = require('../handler/delete.file.handler');

const readFile = (req, res) => {
    const {location} = req.params;
    readSingleFile(location.replaceAll("&","/"), res);
};

const readAllFile = (req, res) => {
    readMultipleFiles(res);
}

const uploadFile = (req, res) => {

    function handleCreateFile(fileObject) {
    
        if (!("files" in fileObject)) {
            res.status(404).json({"error" : "No File Uploaded"});
            return;
        }
    
        if (req.body.length > 1) {
            createMutipleFiles(fileObject.files, res);
        } else {
            createSingleFile(fileObject.files, res);
        }
    }

    if (!("length" in req.body)) {
        res.status(404).json("No length of files provided");
        return;
    }

    if (!("version" in req.body)) {
        res.status(404).json({"error" : "No version reported."})
    }

    if (req.body.version === "web") {
        if (!("files" in req)) {
            res.status(404).json({"error" : "No File Uploaded"});
            return;
        }
        handleCreateFile(req.files);

    } else if (req.body.version === "android") {
        if (!("files" in req.body)) {
            res.status(404).json({"error" : "No File Uploaded"});
            return;
        }
        handleCreateFile(req.body);
    } else {
        res.status(404).json({"error" : "No version available"});
    }


};

const updateFile = (req, res) => {
    if (!req.body) {
        res.status(404).json({"error" : "No body send to the request"});
        return;
    }

    if (!("modify" in req.body)) {
        res.status(404).json({"error" : "No data provided to modify"});
        return;
    }

    if (!("length" in req.body)) {
        res.status(404).json({"error" : "No length of files provided"});
        return;
    }

    function parseData(rawMetadata) {
        if (typeof rawMetadata === 'string') {
            return JSON.parse(rawMetadata);
        }
        return rawMetadata;
    }

    if (req.body.length > 1) {
        const filesToModify = req.body.modify.map((newMetadata) => 
            parseData(newMetadata)
        )
        updateMutipleFiles(filesToModify, res);
    } else {
        updateSingleFile(parseData(req.body.modify), res);
    }
};

const deleteFile = (req, res) => {
    if (!req.body) {
        res.status(404).json({"error" : "No body send to the request"});
        return;
    }

    if (!("location" in req.body)) {
        res.status(404).json({"error" : "No File Selected to Delete"});
        return;
    }

    if (typeof req.body.location === 'string') {
        deleteSingleFile(req.body.location, res);
    } else {
        const locations = req.body.location.map((location) => 
            location
        );
        deleteMutipleFiles(locations, res);
    }
};

module.exports = {
    readFile,
    readAllFile,
    uploadFile,
    updateFile,
    deleteFile
};