/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configurare transporter pentru Gmail
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Funcția pentru trimiterea email-ului VIP
exports.sendVipEmail = functions.https.onCall(async (data, context) => {
  // Verifică dacă utilizatorul este autentificat
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Utilizatorul trebuie să fie autentificat.");
  }

  const {email, nume} = data;

  if (!email || !nume) {
    throw new functions.https.HttpsError("invalid-argument", "Email și nume sunt obligatorii.");
  }

  // Template pentru email-ul VIP
  const mailOptions = {
    from: `ProFX <${gmailEmail}>`,
    to: email,
    subject: "🎉 Felicitări! Acces VIP confirmat - ProFX",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            background: #ffffff;
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 10px 10px 0 0; 
          }
          .content { 
            background: #f9f9f9; 
            padding: 30px; 
            border-radius: 0 0 10px 10px; 
            border: 1px solid #e0e0e0;
          }
          .button { 
            background: #667eea; 
            color: white !important; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            display: inline-block; 
            margin: 20px 0; 
            font-weight: bold;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            color: #666; 
            font-size: 14px; 
          }
          .vip-badge { 
            background: gold; 
            color: #333; 
            padding: 5px 15px; 
            border-radius: 20px; 
            font-weight: bold; 
            display: inline-block; 
            margin: 10px 0; 
          }
          ul li { 
            margin: 8px 0; 
          }
          ol li { 
            margin: 8px 0; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bun venit în clubul VIP ProFX!</h1>
            <div class="vip-badge">✨ MEMBRU VIP ✨</div>
          </div>
          <div class="content">
            <h2>Salut ${nume}!</h2>
            <p>Îți mulțumim pentru încrederea acordată! Contul tău a fost verificat cu succes și acum ai acces complet la toate beneficiile VIP ale platformei ProFX.</p>
            
            <h3>🚀 Ce îți oferim ca membru VIP:</h3>
            <ul>
              <li>📊 Acces la analize avansate de trading</li>
              <li>🎯 Semnale premium de trading</li>
              <li>📚 Materiale educaționale exclusive</li>
              <li>💬 Acces la grupul privat de discuții</li>
              <li>📞 Suport prioritar din partea echipei</li>
              <li>🎥 Sesiuni live de trading exclusive</li>
            </ul>

            <p>Pentru a accesa platforma, folosește următoarele instrucțiuni:</p>
            
            <h3>📋 Instrucțiuni de acces:</h3>
            <ol>
              <li>Accesează platforma ProFX</li>
              <li>Loghează-te cu email-ul: <strong>${email}</strong></li>
              <li>Toate funcționalitățile VIP sunt acum disponibile în contul tău</li>
            </ol>

            <a href="https://profx.app" class="button">🚀 Accesează Platforma VIP</a>

            <p><strong>Important:</strong> Dacă întâmpini probleme la accesare, nu ezita să ne contactezi la profx.app@gmail.com</p>
            
            <div class="footer">
              <p>Cu respect,<br><strong>Echipa ProFX</strong></p>
              <p>📧 profx.app@gmail.com | 🌐 profx.app</p>
              <hr style="margin: 20px 0; border: none; height: 1px; background: #eee;">
              <p style="font-size: 12px; color: #999;">
                Ai primit acest email pentru că contul tău ProFX a fost verificat și ai primit acces VIP.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email VIP trimis cu succes către ${email} pentru ${nume}`);
    return {success: true, message: "Email VIP trimis cu succes!"};
  } catch (error) {
    console.error("Eroare la trimiterea email-ului:", error);
    throw new functions.https.HttpsError("internal", "Eroare la trimiterea email-ului VIP: " + error.message);
  }
});
