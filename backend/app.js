const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config();
const Routes = require('./routes/route')
const serviceTechnique = require('./routes/serviceTechniqueRoutes')
const inviteCommissionRoutes = require('./routes/inviteCommissionRoutes')
const descisionDemandeRoutes = require('./routes/descisionDemandeRoutes')
const presidentRouter = require('./routes/presidentRouter')
const patrimoineRoutes = require('./routes/patrimoineRoutes')
const staticsRoutes = require('./routes/staticsRoutes')
// Set up middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())



// Use the user controller for handling user-related requests
app.use('/', Routes);
app.use('/serviceTechnique', serviceTechnique);
app.use('/representant', inviteCommissionRoutes);
app.use('/descision', descisionDemandeRoutes);
app.use('/president', presidentRouter);
app.use('/patrimoine', patrimoineRoutes);
app.use('/statics', staticsRoutes);




// Start the server
app.listen(process.env.PORT, () => {
  console.log(`serveur running on port ${process.env.PORT}`);
})