/* Instanciando o Express */
const express = require("express");
const app = express();

/* Instanciando outras dependências */
const bodyParser = require("body-parser");

/* Configurações básicas */
app.set('view engine', 'ejs'); //Definindo o motor de views com EJS
app.use(express.static('public')); //Definindo a pasta public como pasta de arquivos estáticos: CSS, imagens e etc
app.use(bodyParser.urlencoded({extended: false})); //Permite decodificar dados enviados pelo formulário
app.use(bodyParser.json()); //Permite decodificar dados enviados por JSON (API)

/* Conectando o database */
const connection = require("./database/database");
connection.authenticate()
    .then(() => {
        console.log("Conexão com o banco de dados realizada com sucesso")
    })
    .catch((msgError) => {
        console.log(msgError);
    })
const Perguntas = require("./database/Perguntas"); //Carregando model
const Respostas = require("./database/Respostas"); //Carregando model

//Rotas
app.get("/", function(req, res){
    Perguntas.findAll({raw: true , order:[['id','DESC']]}).then(queryPerguntas => {
        res.render("index", {
            perguntas: queryPerguntas,
        });
    });
});

app.get("/perguntar", function(req, res){
    res.render("perguntar");
})

app.post("/salvarpergunta", function(req, res){   
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Perguntas.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/');
    });
})

app.get("/pergunta/:id",(req, res) => {
    var id = req.params.id;
    Perguntas.findOne({
        where: {id: id},
    }).then(pergunta =>{
        if(pergunta != undefined){
            Respostas.findAll({
                where: {perguntaId: id},
                order: [['id','DESC']]
            }).then(respostas =>{
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        }else{
            res.redirect("/");
        }
    });
})

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.perguntaId; 
    var usuario = req.body.usuario; 
    Respostas.create({
        usuario: usuario,
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect('/pergunta/' + perguntaId);
    });
});

//Iniciando servidor
app.listen(4000,()=>{
    console.log("Server running");
});