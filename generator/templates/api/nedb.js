import database from "nedb-promise"
let DB = database({
  name: "",
  autoload: true
})
export default DB
