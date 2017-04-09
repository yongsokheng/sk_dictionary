var Realm = require("realm");

const WordSchema = {
  name: "Word",
  primaryKey: "id",
  properties: {
    id:  "int",
    name: {type: "string", indexed: true},
    raw_name: {type: "string", indexed: true},
    meaning: "string",
    word_type: "string"
  }
};

const ExampleSchema = {
  name: "Example",
  primaryKey: "id",
  properties: {
    id:  "int",
    vn_example: "string",
    kh_example: "string",
    "word_id": {type: "int", indexed: true}
  }
};

var key = new Int8Array(64);
const realm = new Realm({schema: [WordSchema, ExampleSchema], encryptionKey: key});
export default realm;
