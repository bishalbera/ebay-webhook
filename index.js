const express = require('express')

const bodyParser = require('body-parser')

const app = express()

const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

app.post('/ebay-webhook', (req, res) => {
    const verificationToken = process.env.VERIFICATION_TOKEN

    if (req.headers['x-ebay-token'] !== verificationToken) {
        return res.status(403).send('Unauthorized')
    }

    console.log('Received ebay noti', req.body);

    res.status(200).send('Noti received')
})

app.listen(PORT, () => {
  console.log(
    `Webhook server running on http://localhost:${PORT}/ebay-webhook`
  );
});

