// netlify/functions/notasMD.js
const fetch = require('node-fetch'); // Si usas Node < 18

exports.handler = async function (event, context) {
    const TOKEN = process.env.TOKEN_API; // Netlify inyectará esto aquí de forma segura
    const urlCarpeta = "https://api.github.com/repos/Joan335/notes-markdown/contents/notes/";

    try {
        const respuesta = await fetch(urlCarpeta, {
            headers: { 'Authorization': `token ${TOKEN}` }
        });
        const datos = await respuesta.json();

        return {
            statusCode: 200,
            body: JSON.stringify(datos),
        };
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};