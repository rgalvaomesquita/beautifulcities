const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
var pg = require('pg')
var conString = "postgres://localhost/beautycities";

const config = {
  user: 'postgres',
  database: 'beautycities',
  password: 'admin12345',
  port: 5432                  //Default port, change it if needed
};

var pool = new pg.Pool(config)

// connection using created pool
/*pool.connect(function(err, client, done) {

  if (err) {
    return console.error('error running query', err);
  }else{
    client.query('SELECT $1::int AS number', ['1'], function(err, result) {
      done();
      
      console.log(result.rows[0].number);
    });
  }
})*/


app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'public')))

app.listen(port, (err) => {
    if(err){
        console.log('Não foi possível iniciar o servidor do BeatyCities!')
    }else{
        console.log('Servidor do BeautyCities rodando!')
    }
})

app.get('/', async(request,response) => {
    const client = await pool.connect()
    try {
      const cidades = await pool.query('SELECT * from cidades order by name;')
      
      response.render('home', {
        cidades
      })
      await client.end()
    } catch (err) {
      console.log(err.stack)
    }
    
})


app.get('/cidade/:id',async(request,response) => {

  //const client = await pool.connect()
  try {
    
    const ruas = await pool.query(`select * from ruas where fk_cidade_id = $1::integer`, [request.params.id])
    
    const cidade = await pool.query(`select name from cidades where id = $1::integer`, [request.params.id])
    
    const locations = await pool.query(`select * from locations where id_cidade = $1::integer`, [request.params.id])
    
    response.render('cidade', {cidade,ruas,locations})
    
// await client.end()
  } catch (err) {
    console.log(err.stack)
  }
  

})

app.get('/maps',async(req,res)=>{
  res.render('maps')
})

