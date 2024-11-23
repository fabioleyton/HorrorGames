const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const mysql = require("mysql2/promise"); // Conexión a MySQL
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
const PORT = 3000;

// Configuración de la base de datos MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Joel231903",
    database: process.env.DB_NAME || "pagos",
});

// Configuración de PayPal
const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT || "AVftCtLcp_Gmxaf30xomIpzCPWJP734pR8rZYCpP57JSTOmT23AZdFCUp7KqPHTv0mKGMID86Twixws-";
const PAYPAL_SECRET = process.env.PAYPAL_SECRET || "EE8DkBwE15GvaBCGvE5JA02NfQFdd8cJHvQD9PZirkqa0-5u0zpUaYjq_NKojXyfMRd1b1g9Gy4ffjjn";
const PAYPAL_API = process.env.PAYPAL_API || "https://api.sandbox.paypal.com"; // Cambiar a `https://api.paypal.com` en producción

// Obtener token de acceso de PayPal
async function getAccessToken() {
    try {
        const response = await axios({
            url: `${PAYPAL_API}/v1/oauth2/token`,
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: {
                username: PAYPAL_CLIENT,
                password: PAYPAL_SECRET,
            },
            data: "grant_type=client_credentials",
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Error al obtener el token de acceso:", error.response?.data || error.message);
        throw new Error("No se pudo obtener el token de acceso.");
    }
}

// Ruta para crear el pago
app.post("/api/pagar", async (req, res) => {
    const { usuario, articulo, precio } = req.body;

    if (!usuario || !articulo || !precio) {
        return res.status(400).json({ mensaje: "Faltan parámetros requeridos." });
    }

    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${PAYPAL_API}/v1/payments/payment`,
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            data: {
                intent: "sale",
                payer: {
                    payment_method: "paypal",
                },
                transactions: [
                    {
                        amount: {
                            total: precio,
                            currency: "USD",
                        },
                        description: `Compra del artículo: ${articulo}`,
                    },
                ],
                redirect_urls: {
                    return_url: "http://localhost:3000/success",
                    cancel_url: "http://localhost:3000/cancel",
                },
            },
        });

        // Redirigir al usuario al enlace de aprobación de PayPal
        const approvalUrl = response.data.links.find(
            (link) => link.rel === "approval_url"
        ).href;
        res.json({ approvalUrl });
    } catch (error) {
        console.error("Error al crear el pago:", error.response?.data || error.message);
        res.status(500).json({ mensaje: "Error al crear el pago." });
    }
});

// Ruta para capturar el pago
app.get("/success", async (req, res) => {
    const { paymentId, PayerID } = req.query;

    try {
        const accessToken = await getAccessToken();
        const capture = await axios({
            url: `${PAYPAL_API}/v1/payments/payment/${paymentId}/execute`,
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            data: {
                payer_id: PayerID,
            },
        });

        // Obtener información del pago
        const { transactions, payer } = capture.data;
        const usuario = payer.payer_info.email; // O ajusta según tu lógica
        const articulo = transactions[0].description;
        const tarjeta = payer.payer_info.email; // Este ejemplo usa el email como tarjeta
        const fecha = new Date();

        // Guardar información en la base de datos
        const query = `
            INSERT INTO facturas (usuario, articulo, tarjeta, fecha)
            VALUES (?, ?, ?, ?)
        `;
        await db.execute(query, [usuario, articulo, tarjeta, fecha]);

        res.send("Pago exitoso, factura generada.");
    } catch (error) {
        console.error("Error al capturar el pago:", error.response?.data || error.message);
        res.status(500).json({ mensaje: "Error al capturar el pago." });
    }
});
// Ruta para cancelar el pago
app.get("/cancel", (req, res) => {
    res.send("Pago cancelado.");
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});