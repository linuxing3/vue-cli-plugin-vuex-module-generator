import database from "nedb-promise"

let collections = ["user"]
let pool = {};

/**
 * Database persistence Module
 */

export function dbOpen(collection) {
  return pool[collection];
}

/**
 * Init persistence database pool
 */
export function dbInit() {
  // Create system-level collection collections.json
  dbCreate("collections");
  dbCreate("account");
  // Create user-level collections like user.json
  dbCreateUserLevelCollection(collections);
}

/**
 * Init persistence database pool
 */
export function dbResetAll() {
  // Create system-level collection collections.json
  dbRemove("collections");
  dbRemove("roles");
  // Create user-level collections like user.json
  collections.map(item => dbRemove(item));
}

/**
 * Creating a collection with real path and add to pool
 * @param collection Name of the db collection
 */
export function dbCreate(collection) {
  let fileName = `${collection}.json`;
  let filePath = path.join(userPath, fileName);
  // Create collections instance and add to pool
  let DB = datastore({
    autoload: true,
    filename: filePath,
  });
  pool[collection] = DB;
  // add collection information to collections
  let systemDB = dbOpen("collections");
  systemDB.find({ collection: collection }).then((docs: any[]) => {
    if (docs.length === 0) systemDB.insert({ collection, fileName, filePath });
  });
}

/**
 * Create Default Collections if not exist
 *
 * Check the UserData Folder if user.json and other files exist
 * If not, call defaultCollections as array
 * Loop through and create databases files
 * Load into pool
 */
export function dbCreateUserLevelCollection(collections) {
  for (let collection of collections) {
    // Omiting system-level db.json
    if (collection === "collections" || collection === "roles") return;
    // check if other user-level collection exists
    dbCreate(collection);
    log.suc("Created " + collection + ".json in you UserData directory!");
  }
}

/**
 * Remove the collections.json files from hard disk
 */

export function dbRemove(collection) {
  let fileName = `${collection}.json`;
  let filePath = path.join(userPath, fileName);
  if (fs.existsSync(filePath)) {
    log.err("Removing...");
    fs.rmdirSync(filePath);
  }
}
