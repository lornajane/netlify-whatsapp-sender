const Nexmo = require('nexmo')
require('dotenv').config()

exports.handler = async (event, context) => {
  try {
    const subject = event.queryStringParameters.name || 'World'
    const body = event.body
    const data = JSON.parse(body)
    console.log(data)
    console.log(data['Title'])
    console.log(data['From'])

    const nexmo = new Nexmo({
      apiKey: process.env.NEXMO_API_KEY,
      apiSecret: process.env.NEXMO_API_SECRET,
      applicationId: process.env.NEXMO_APPLICATION_ID,
      privateKey: Buffer.from(process.env.NEXMO_APPLICATION_PRIVATE_KEY.replace(/\\n/g, "\n"), 'utf-8')
    }, {
      apiHost: process.env.API_HOST
    })

    nexmo.channel.send(
      { "type": "whatsapp", "number": process.env.TO_NUMBER },
      { "type": "whatsapp", "number": process.env.WHATSAPP_NUMBER },
      {
        "content": {
          "type": "text",
          "text": "New message from " + data['From'] + ": " + data['Title']
        }
      },
      (err, data) => {
        if (err) {
          console.error(err);
        } else {
          console.log(data.message_uuid);
        }
      }
    );


    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Greetings ${subject}` })
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
