const Data = require('./radar.csv')

const mapCsvToObject = (rows) => {
  const columns = rows[0]
  rows.shift()
  return {
    columns,
    data: rows.map(row => {
      const obj = {}
      columns.forEach((column, index) => { obj[column] = row[index] })
      return obj
    })
  }
}

module.exports = () => mapCsvToObject(Data)
