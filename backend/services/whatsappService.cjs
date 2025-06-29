const axios = require("axios");
require("dotenv").config();

const sendWhatsAppMessage = async (to, name, date, time) => {
  const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const token = process.env.WHATSAPP_TOKEN;

  // Format the phone number for Egypt (country code 20)
  let normalizedMobile = to.replace(/[^0-9]/g, "");
  if (normalizedMobile.startsWith("0")) {
    normalizedMobile = "2" + normalizedMobile;
  } else if (!normalizedMobile.startsWith("2")) {
    normalizedMobile = "2" + normalizedMobile;
  }

  // Use a pre-approved template (replace with your template name and params)
  const data = {
    messaging_product: "whatsapp",
    to: normalizedMobile,
    type: "template",
    template: {
      name: "hello_world", // Your approved template name
      language: { code: "en_US" },
      // components: [
      //   {
      //     type: "body",
      //     parameters: [
      //       { type: "text", text: name },
      //       { type: "text", text: new Date(date).toLocaleDateString() },
      //       { type: "text", text: time },
      //     ],
      //   },
      // ],
    },
  };

  await axios.post(url, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

module.exports = { sendWhatsAppMessage };

// require("dotenv").config();
// const axios = require("axios");

// async function sendTemplateMessage() {
//   const response = await axios({
//     url: "https://graph.facebook.com/v20.0/727980860394651/messages",
//     method: "post",
//     headers: {
//       Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
//       "Content-Type": "application/json",
//     },
//     data: JSON.stringify({
//       messaging_product: "whatsapp",
//       to: "+201014283454",
//       type: "template",
//       template: {
//         name: "hello_world",
//         language: {
//           code: "en_US",
//         },
//         components: [
//           {
//             type: "header",
//             parameters: [
//               {
//                 type: "text",
//                 text: "John Doe",
//               },
//             ],
//           },
//           {
//             type: "body",
//             parameters: [
//               {
//                 type: "text",
//                 text: "50",
//               },
//             ],
//           },
//         ],
//       },
//     }),
//   });

//   console.log(response.data);
// }

// sendTemplateMessage();

// sendTextMessage()

// sendMediaMessage()

// uploadImage()
