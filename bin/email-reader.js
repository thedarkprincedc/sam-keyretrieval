const { ImapFlow } = require('imapflow');
const { simpleParser } = require("mailparser");
const config = require("config");

const { imap } = config;
const client = new ImapFlow(imap);

function sanitizeString(str){
    return str
        .replace( /<br>/ig, '\n')
        .replace( /(<([^>]+)>)/ig, '')
}
function extractOTP(str){
    return str.match(/[\d]{6}/ig)
}

async function readMail(){
    await client.connect();
    let lock = await client.getMailboxLock('INBOX');
    try {
        // fetch latest message source
        // client.mailbox includes information about currently selected mailbox
        // "exists" value is also the largest sequence number available in the mailbox
        let message = await client.fetchOne(client.mailbox.exists, { source: true, bodyStructure: true, envelope: true });
        const messageBody = await simpleParser(message.source)
        const cleanedString = sanitizeString(messageBody.html)
        const otp = extractOTP(cleanedString)
        if(!otp){
            throw new Error('SAM.gov token email not found')
        }
        //console.log(otp[0])

        //console.log(message);
      // console.log(message.source.toString());

        // list subjects for all messages
        // uid value is always included in FETCH response, envelope strings are in unicode.
        // for await (let message of client.fetch('*', { envelope: true })) {
        //     console.log(`\n\n${message.envelope.subject}\n\n`)
        //     console.log(message.envelope)
        //     console.log(message)
        //     //console.log(`${message.uid}: ${message.envelope.subject}`);
        // }
        //return otp[0]
    } finally {
        // Make sure lock is released, otherwise next `getMailboxLock()` never returns
        lock.release();
    }

    // log out and close connection
    await client.logout();
}
setTimeout(async () => {
    console.log('Fetching the newly send mail', new Date().toString());
    const mk = await readMail();
    console.log(mk)
}, 500);

// module.exports = {
//     readMail
// }