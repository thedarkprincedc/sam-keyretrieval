const { ImapFlow } = require('imapflow');
const { simpleParser } = require("mailparser");
const config = require("config");
const { imap } = config.email;
const client = new ImapFlow(imap);

function sanitizeStr(str){
    return str
        .replace( /<br>/ig, '\n')
        .replace( /(<([^>]+)>)/ig, '')
}
function extractOneTimePass(str){
    return str.match(/[\d]{6}/ig)
}

async function readEmail(){
    console.log('Fetching the newly send mail', new Date().toString());
    await client.connect();
    let lock = await client.getMailboxLock('INBOX');
    let message = await client.fetchOne(client.mailbox.exists, { source: true, bodyStructure: true, envelope: true });
    const messageBody = await simpleParser(message.source)
    const otp = extractOneTimePass(sanitizeStr(messageBody.html));
    lock.release();
    // console.log(message);
    // console.log(message.source.toString());
    // console.log(cleanedString)
    await client.logout();
    if(!otp){
        throw new Error('SAM.gov token email not found')
    }
    return otp[0]
}   

module.exports = {
    readEmail
}