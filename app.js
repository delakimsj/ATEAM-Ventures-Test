const express = require('express')

const app = express()
const port = 3000

// API mapping according to biz parts
const bizParts = ['store'] 
let bizPartXhrRouter = []
for(let i = 0; i < bizParts.length; ++i){
    bizPartXhrRouter[i] = require(`./routes/api/${bizParts[i]}Api`)
    
    // app.use(`/${bizParts[i]}/api`, async (_req, _res, _next)=>{
    app.use(`/api/${bizParts[i]}`, async (_req, _res, _next)=>{
        new Promise((_resolve, _reject)=>{
            // API처리를 위한 전처리

            // API 호출
            bizPartXhrRouter[i](_req, _resolve, _reject)
        }).then((_result)=>{ 
            // 정상종료
            _res.status(200)

            _res.send(_result)
        }).catch((_error) => {
            // 비정상종료
            // _error가 undefined면 404에러로 볼수 있다
            _error == undefined ? _res.status(404) : _res.status(501)
            
            _res.send(_error)
        }).finally(()=>{
        })
    })
}

// start a server
app.listen(port, () => console.log('server is on'))