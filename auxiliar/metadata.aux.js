const Metadata = Object.freeze({
    // Desire key, search key
    UPLOAD: {
        data : "data",
        metadata : {
            name : "name",
            size : "size",
            contentEncoding : "encoding",
            contentType : "mimetype",
            md5Hash : "md5",
            customMetadata : {
                truncated : "truncated"
            }
        }
    },
    UPDATE: {
        name : "name",
        size : "size",
        contentEncoding : "encoding",
        contentType : "mimetype",
        md5Hash : "md5",
        customMetadata : null
    }
})

function createMetadata(rawData, structure) {
    const metadata = {};

    function traverse(struc, obj) {
        for (let key in struc) {
            if (!(struc.hasOwnProperty(key))) {
                continue;
            }

            if (key === 'customMetadata' && struc[key] === null) {
                obj[key] = rawData;
                continue; 
            }

            if (typeof struc[key] === 'object' && struc[key] !== null) {
                obj[key] = new Object();
                traverse(struc[key], obj[key]);
                continue;
            }

            if (rawData.hasOwnProperty(struc[key])) {
                const rawDataValue = rawData[struc[key]]
                obj[key] = rawDataValue;
                delete rawData[struc[key]];
                continue
            }
        }
    }

    traverse(structure, metadata);
    return metadata;
}

module.exports = {
    createMetadata,
    Metadata
}