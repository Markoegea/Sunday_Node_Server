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
    if (!("files" in req)) {
        return;
    }

    if (!req.files) {
        res.status(404).json("No File Uploaded");
        return;
    }

    if (!("files" in req.files)) {
        return;
    }

    if (req.body.length > 1) {
        createMutipleFiles(req.files.files, res);
    } else {
        createSingleFile(req.files.files, res);
    }
};

const updateFile = (req, res) => {
    if (!req.body) {
        res.status(404).json("No body send to the request");
        return;
    }

    if (!("modify" in req.body)) {
        res.status(404).json("No data provided to modify");
        return;
    }

    if (typeof req.body.modify === 'string') {
        updateSingleFile(JSON.parse(req.body.modify), res);
    } else {
        const filesToModify = req.body.modify.map((newMetadata) => 
            JSON.parse(newMetadata)
        )
        updateMutipleFiles(filesToModify, res);
    }
};

const deleteFile = (req, res) => {
    if (!req.body) {
        res.status(404).json("No body send to the request");
        return;
    }

    if (!("location" in req.body)) {
        res.status(404).json("No File Selected to Delete");
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