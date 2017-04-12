const VersionSchema = {
  name: "Version",
  primaryKey: "id",
  properties: {
    id:  "int"
  }
};

const realm = new Realm({schema: [VersionSchema]});
export default realm;
