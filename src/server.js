import http from 'http';
import WebSocket from "ws";
import express from "express";

const app = express();

app.set('view engine',"pug"); //뷰엔진을 퍼그로 설정
app.set("views",__dirname+"/views"); //뷰 파일들의 위치 정보(뷰폴더) 설정
app.use("/public", express.static(__dirname+"/public")); //스태틱 파일 위치 설정

app.get("/",(req,res) => res.render("home")); //"/"로 요청하면 뷰폴더의 home파일을 보여줌
app.get("/:path",(req,res) => res.redirect("/"));

const handleListen = () =>{
    console.log(`Listening on http://localhost:3000`);
}

const server = http.createServer(app);
//http서버를 만듬
const wss = new WebSocket.Server({server});
//http서버 위에 ws서버를 만듬

//가짜 데이터베이스
const sockets = [];

//여기서 socket은 연결된 브라우저를 뜻함함
wss.on("connection", (socket) =>{
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser");
    socket.on("close",()=>console.log("Disconnected from Server"));
    socket.on("message",(msg)=>{
        const message = JSON.parse(msg); //프론트에서 문자열로 보내준걸 다시 object로 변환
        switch(message.type){
            case "new_message":
                sockets.forEach(aSocket =>{
            aSocket.send(`${socket.nickname}:${message.payload}`);
            })
            case "nickname":
                socket["nickname"] = message.payload;
        }
        
       
    })
    
})

server.listen(3000, handleListen);

