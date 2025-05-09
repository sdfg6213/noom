const messageList = document.querySelector("ul");
const nickForm =document.querySelector("#nick");
const messageForm =document.querySelector("#message");
//여기서 소켓은 프론트엔드에서 서버로의 연결을 뜻함
const socket = new WebSocket(`ws://${window.location.host}`);

function MakeMessage(type, payload){
    const msg = {type, payload};
    return JSON.stringify(msg);
}
//백엔드가 어떤 언어를 쓸지 모르기 때문에 javascript object를 사용하면 안되고 stringify로 문자열로 변환해서 백엔드로 보내줘야 한다

socket.addEventListener("open", ()=>{
    console.log("Connected to Browser");
});

socket.addEventListener("message",(message)=>{
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
})

socket.addEventListener("close",()=>{
    console.log("Connected from server => X");
})

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(MakeMessage("new_message",input.value));
    input.value="";
    console.log(input.value);
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(MakeMessage("nickname",input.value));
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);