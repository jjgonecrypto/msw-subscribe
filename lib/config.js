module.exports = {
    sendgrid: {
        user: process.env.SENDGRID_USERNAME,
        key: process.env.SENDGRID_PASSWORD
    },
    msw: {
        apiKey: process.env.MSW_API_KEY
    }
};