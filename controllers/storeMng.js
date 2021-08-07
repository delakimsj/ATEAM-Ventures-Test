const storeModel    = require('../models/storeModel')
const postcodes     = require('node-postcodes.io')

/**
* DESCRIPTION   : get a list of stores
* NOTES         : 
**/
module.exports.getListStore = async () => {
    try {
        return storeModel.getListStore()
    } catch (err) {
        console.log(`error in ${module.id} : ${err}`)
        throw err
    }
}

/**
* DESCRIPTION   : get a list of specific column of stores
* NOTES         : if itemname is not in columns, return false
**/
module.exports.getListStoreByItemName = async (inItemName) => {
    try {
        // current data column set
        const columns = ['name', 'postcode']

        if(columns.includes(inItemName)){
            return storeModel.getListStore().map(x => x[inItemName])
        } else {
            return false
        }
    } catch (err) {
        console.log(`error in ${module.id} : ${err}`)
        throw err
    }
}

/**
* DESCRIPTION   : get a list of stores and its geo info(latitude, longitude)
* NOTES         : not geoinfo, then geoinfo is "NO"
**/
module.exports.getListStorePostCode = async () => {
    try {
        // get a whole list of geo info of each store
        let rslPostCodes = await postcodes.lookup(storeModel.getListStore().map(x=>x.postcode), {
            filter: 'postcode,longitude,latitude'
        })

        // transform object to dictionary for searching
        let dictPostcode = {}
        for(let i of rslPostCodes.result)
        {
            if(i.result){
                dictPostcode[i.query] = {
                    'lat' : i.result.latitude  ? i.result.latitude  : 0
                  , 'lon' : i.result.longitude ? i.result.longitude : 0
              }  
            }
        }

        // mapping geo info to each store
        let stores = storeModel.getListStore()
        for(let i of stores){
            if(dictPostcode[i.postcode]){
                i.geoinfo = "YES"
                i.lat = dictPostcode[i.postcode].lat
                i.lon = dictPostcode[i.postcode].lon    
            } else {
                i.geoinfo = "NO"
            }
        }

        // return stores having geo info
        return stores
    } catch (err) {
        console.log(`error in ${module.id} : ${err}`)
        throw err
    }
}

/**
* DESCRIPTION   : a list of stores in a given radius of a given postcode in the UK
* NOTES         : return false in case of invalid postcode
*                 excluding stores not having a geoinfo
**/
module.exports.getListStoreBySearchByGeo = async (inPostcode, inRadius) => {
    try {
        // get geo info from postcode
        let resultPostcode = await postcodes.lookup(inPostcode)
        if(resultPostcode.status == 404){
            console.log(`error in ${module.id} : ${resultPostcode.error}`)
            return false
        }

        let fromLat  = resultPostcode.result.latitude
        let fromLon  = resultPostcode.result.longitude
        
        // get a list of stores having geoinfo
        let storePostCode = await this.getListStorePostCode()
        
        let result = []
        const {getDistance} = require('geolib')
        for(let sp of storePostCode){
            if(sp.geoinfo == 'YES'){
                // if store has a geoinfo, then calculate a distance
                let dist = getDistance(
                    { latitude: fromLat, longitude: fromLon }
                  , { latitude: sp.lat , longitude: sp.lon } 
                  , 1
                )
                
                // if a distance is smaller than radius, then push a store into result
                if(dist <= inRadius){
                    result.push(sp)
                }
            }
        }
        
        // The list must be ordered from north to south
        result.sort((x,y)=>{return y.lat - x.lat})

        // return a list of name of each store
        return result.map(x => x.name)
    } catch (err) {
        console.log(`error in ${module.id} : ${err}`)
        throw err
    }
}