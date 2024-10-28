class Encoding {
    setNextHandler(next) {
        this.next = next;
        return this;
    }

    handle(stroageRef, data, metadata, resolve, reject) {
        return undefined;
    }

    handleNext(storageRef, data, metadata, resolve, reject) {
        if (this.next === undefined) {
            return reject("No handle found!");
        }
        return this.next.handle(storageRef, data, metadata, resolve, reject);
    }
}

module.exports = {
    Encoding
}