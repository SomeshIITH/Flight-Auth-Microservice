const express = require('express');
const bodyParser = require('body-parser');
const {PORT} = require('./config/serverConfig.js');
const apiRoutes = require('./routes/index.js');
const db = require('./models/index.js');

const SetupServer = async () => {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use('/api' , apiRoutes);

    app.listen(PORT,async () => {
        console.log(PORT);
        console.log(`Server is running on http://localhost:${PORT}`);
        // if(process.env.SYNC_DB){
        //     db.sequelize.sync({alter : true});
        // }
        
    })
}

SetupServer();
