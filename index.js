const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')




/*var pg = require('pg')

const config = {
  user: "ejnktmfophwmce",
  password: "c0b0605fb928c58dfd4c41ff54b9ca11e97904c410ac08a02c18e1e04c5da6a2",
  database: "d1kktm0euitb3a",
  port: 5432,
  host: "ec2-3-91-112-166.compute-1.amazonaws.com",
  ssl: true
};
var pool = new pg.Pool(config)*/
/*
const { Client } = require('pg');

const client = new Client({
  user: "ejnktmfophwmce",
  password: "c0b0605fb928c58dfd4c41ff54b9ca11e97904c410ac08a02c18e1e04c5da6a2",
  database: "d1kktm0euitb3a",
  port: 5432,
  host: "ec2-3-91-112-166.compute-1.amazonaws.com",
  ssl: true
});

client.connect();
*/


const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();








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
    //const client = await pool.connect()
    try {
      const cidades = await client.query('SELECT * from cidades order by name;')
      
      response.render('home', {
        cidades
      })
      //await client.end()
    } catch (err) {
      console.log(err.stack)
    }
    
})


app.get('/cidade/:id',async(request,response) => {

  //const client = await pool.connect()
  try {
    
    const ruas = await client.query(`select * from ruas where fk_cidade_id = $1::integer`, [request.params.id])
    
    const cidade = await client.query(`select name from cidades where id = $1::integer`, [request.params.id])
    
    const locations = await client.query(`select * from locations where id_cidade = $1::integer`, [request.params.id])

    const num_ruas_pav = await client.query(`select count(id) from ruas where tipo_pav = 1 and fk_cidade_id = $1::integer`, [request.params.id])
  
    const num_ruas_sto = await client.query(`select count(id) from ruas where tipo_pav = 2 and fk_cidade_id = $1::integer`, [request.params.id])
  
    const num_ruas_unp = await client.query(`select count(id) from ruas where tipo_pav = 3 and fk_cidade_id = $1::integer`, [request.params.id])
    console.log(num_ruas_pav)
    console.log(num_ruas_sto)
    console.log(num_ruas_unp)
    response.render('cidade', {cidade,ruas,locations, num_ruas_pav, num_ruas_sto, num_ruas_unp })
    
// await client.end()
  } catch (err) {S
    console.log(err.stack)
  }
  

})

app.get('/maps',async(req,res)=>{
  res.render('maps')
})

