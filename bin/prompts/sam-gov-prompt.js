const {prompt} = require('enquirer')

module.exports = {cliPrompt}

function canSkip(parameter){
    return (parameter)?true:false;
}
async function cliPrompt(options){
    const {emailAddress, password, secretKey} = options;

    const questions = [
        {
          type: 'input',
          name: 'emailAddress',
          message: 'What is your emailAddress?',
          initial: emailAddress,
          skip: canSkip(emailAddress)
        },
        {
          type: 'password',
          name: 'password',
          message: 'What is your password?',
          initial: password,
          skip: canSkip(password)
        },
        {
            type: 'input',
            name: 'secretKey',
            message: 'What is your secretKey?',
            initial: secretKey,
            skip: canSkip(secretKey)
        }
    ];

    return await prompt(questions)
        .then( (response) => {
            options.emailAddress = response.emailAddress
            options.password = response.password
            options.secretKey = response.secretKey
        })
        .catch( (error) => {
            console.error(error)
            process.exit(1)
        });;
}