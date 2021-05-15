const util = require('util');
const stream = require('stream');

const { firebase } = require('../../lib');

const pipeline = util.promisify(stream.pipeline);

async function uploadImage(userId, isPublic, readFileStream) {
  const { filename, mime: contentType } = readFileStream;
  const bucket = await firebase.buckerCreateWriteStream(userId, isPublic, filename, contentType);

  await pipeline(readFileStream, bucket.bucketWriteStream);

  return bucket.fileUrl;
}

module.exports = { uploadImage };
