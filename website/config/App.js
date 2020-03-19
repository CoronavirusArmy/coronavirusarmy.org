export default  {

    app: 'CoronavirusArmy',
    apiUrl: process.env.isDev === false ? 'https://api.coronavirusarmy.org' : 'http://localhost:8080',
    rootUrl: process.env.isDev === false ? 'https://coronavirusarmy.org' : 'http://localhost:3000',
    domain: process.env.isDev === false ? 'coronavirusarmy.org' : 'localhost',
    secure: process.env.isDev === false ? true : false,

    expiration: 2, // 2 days

}