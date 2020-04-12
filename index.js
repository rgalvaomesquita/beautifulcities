const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
const fs = require('fs');



const { Client } = require('pg');
let client;
try {
  if (fs.existsSync('secure_data.json')) {
    let rawdata = fs.readFileSync('secure_data.json');
    let data = JSON.parse(rawdata);
    client = new Client({
      user: data.bd_heroku.user,
      password: data.bd_heroku.password,
      database: data.bd_heroku.database,
      port: data.bd_heroku.port,
      host: data.bd_heroku.host,
      ssl: data.bd_heroku.ssl
    });
  }
  else{
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });
  }
} catch(err) {
  console.error(err)
}





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
  
    response.render('cidade', {cidade,ruas,locations, num_ruas_pav, num_ruas_sto, num_ruas_unp })
    
// await client.end()
  } catch (err) {S
    console.log(err.stack)
  }
  

})

app.get('/maps',async(req,res)=>{
  res.render('maps')
})

