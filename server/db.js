const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();
const username = process.env.U;
const password = process.env.P;

// const development = process.env.development;

// if (development === true){
//   console.log("Development",development)

//   const MONGO_URI = `mongodb+srv://${username}:${password}@cluster0.su9cocn.mongodb.net/dev?retryWrites=true&w=majority`;

//   mongoose.connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//     .then(() => {
//       console.log('Connected to MongoDB');
//     })
//     .catch((error) => {
//       console.error('Error connecting to MongoDB:', error);
//     });
  

// } else if (development === false){
//   console.log("Development",development)
//   const MONGO_URI = `mongodb+srv://${username}:${password}@cluster0.su9cocn.mongodb.net/test?retryWrites=true&w=majority`;

//   mongoose.connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//     .then(() => {
//       console.log('Connected to MongoDB');
//     })
//     .catch((error) => {
//       console.error('Error connecting to MongoDB:', error);
//     });
  

// }

const MONGO_URI = `mongodb+srv://${username}:${password}@cluster0.su9cocn.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });



