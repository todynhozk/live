const express = require("express");
const WebSocket = require("ws");

const app = express();
const PORT = 3000;

let objetos = [
    { nome: "Poltrona1", local: "Sala A", dataAlocacao: "2024-11-10", diasAlocacao: 5, status: "Locada" },
];

app.use(express.json());

app.get("/objetos", (req, res) => {
    res.json(objetos);
});

app.post("/objetos", (req, res) => {
    objetos = req.body;
    broadcast(JSON.stringify(objetos));
    res.status(200).send("Dados atualizados");
});

const server = app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
const wss = new WebSocket.Server({ server });

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

wss.on("connection", ws => {
    ws.send(JSON.stringify(objetos));
});
