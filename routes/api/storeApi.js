/**
* FILENAME : storeApi.js 
*
* DESCRIPTION :
*
* FUNCTIONS :
*
* NOTES :
*       
*
* AUTHOR :    Sungjin Kim        START DATE :    07 Aug 21
*
* CHANGES :
*
* REF_NO   VERSION   DATE       WHO              DETAIL
*              0.1   07Aug21    Sungjin Kim      started
*
**/
const express = require('express')
const router  = express.Router()

const storeMng    = require('../../controllers/storeMng'   )

/**
* DESCRIPTION   : get the list of stores
* NOTES         : according to a query, it returns a specific item of stores
**/
router.get('/', function(req, resolve, reject)  {
    if(!req.query.column){
        // get the list of stores in stores.json
        storeMng
        .getListStore()
        .then(
            (value)=>{
                resolve({success : 'Y', result : value})
            }
        )
        .catch((err)=>{        
            console.log(`error in ${module.id} : ${err}`)
            reject({success : 'N', message : `error from server`})
        })
    } else {
        // get the specific item of stores in stores.json
        storeMng
        .getListStoreByItemName(req.query.column)
        .then(
            (value)=>{
                if(value){
                    resolve({success : 'Y', result : value})
                } else {
                    resolve({success : 'N', message : 'invalid item name'})
                }
            }
        )
        .catch((err)=>{        
            console.log(`error in ${module.id} : ${err}`)
            reject({success : 'N', message : `error from server`})
        })
    }
})

/**
* DESCRIPTION   : get the latitude and longitude for each postcode.
* NOTES         :
**/
router.get('/geoinfo', function(req, resolve, reject)  {
    storeMng
    .getListStorePostCode()
    .then(
        (value)=>{
            resolve(value)
        }
    )
    .catch((err)=>{        
        console.log(`error in ${module.id} : ${err}`)
        reject({success : 'N', message : `error from server`})
    })
})

/**
* DESCRIPTION   : return a list of stores in a given radius of a given postcode in the UK
* NOTES         :
**/
router.get('/search_by_geo/', function(req, resolve, reject)  {
    storeMng
    .getListStoreBySearchByGeo(req.query.postcode, req.query.radius)
    .then(
        (value)=>{
            if(value) {
                resolve({success : 'Y', result : value})
            } else {
                resolve({success : 'N', message : `invalid postcode`, result : value})
            }
        }
    )
    .catch((err)=>{        
        console.log(`error in ${module.id} : ${err}`)
        reject({success : 'N', message : `error from server`})
    })
})

module.exports = router