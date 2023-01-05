require('dotenv').config()

const config = {
    insecureRequests: false,
    chromium: {
        headless: true,
        slowMo: 0
    },
    samdotgov : {
        emailAddress: process.env.SAM_GOV_EMAILADDRESS,
        password: process.env.SAM_GOV_PASSWORD,
        secretKey: process.env.SAM_GOV_SECRETKEY
    },
    email: {
        waitToCheckEmail: 5000,
        imap: {
            host: process.env.IMAP_EMAIL_HOST,
            port: Number(process.env.IMAP_EMAIL_PORT),
            secure: true,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            },
            logger: false
        }
    } 
};

if(config.insecureRequests){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
}


module.exports = config;