const csv = require("csv-parser");
const { Readable } = require("stream");

const parseCsvBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const results = [];

    const stream = Readable.from(buffer);

    stream
    .pipe(csv())
    .on("data", (row) => results.push(row))
    .on("end", () => resolve(results))
    .on("error", reject);
});
};

module.exports = { parseCsvBuffer };
