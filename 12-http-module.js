const http = require('http')
const server = http.createServer((req,res)=>{
    //console.log(req.url);
    if(req.url === '/'){
        res.end('welcome to the home page')
    }
    if(req.url === '/about'){
        res.end('this is the about page')
    }
    // res.end(`
    //     <h1>Oops!</h1>
    //     <p> page not found </p>
    //     <a href='/'> back home </a>
    // `)
    //res.end('Oops! page not found')
    

})

server.listen(5003)