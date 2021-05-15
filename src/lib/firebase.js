const admin = require('firebase-admin');

const { firebase } = require('../config');

admin.initializeApp({
  credential: admin.credential.cert(firebase.serviceAccount),
  storageBucket: firebase.storageBucker,
});

const bucket = admin.storage().bucket();

async function buckerCreateWriteStream(userId, isPublic, filename, contentType) {
  const options = {
    metadata: {
      uid: userId,
      public: isPublic,
    },
    contentType,
  };

  const file = bucket.file(filename);

  return { fileUrl: file.id, bucketWriteStream: file.createWriteStream(options) };
}

function getFileFromBucket(filename) {
  return bucket.file(filename);
}

module.exports = {
  buckerCreateWriteStream,
  getFileFromBucket,
};
