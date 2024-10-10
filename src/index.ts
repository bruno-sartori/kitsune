import 'module-alias/register';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import routes from '@routes/index';
import notFoundMiddleware from '@middlewares/404.middleware';
import morgan from 'morgan';
import authConfig from '@config/auth';
import firebase from './database/firebase/connection';
import { collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import IntentExecutorService from '@services/intent-executor.service';
import { ExecuteIntent } from '@interfaces/google-intents';

// Initialize express app
const app = express();

app.use((req, res, next) => {
  // @ts-ignore
  req.firebase = firebase;
  next();
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

if (process.env.API_TYPE === 'server') {
  app.use(session({ secret: authConfig.secret, resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());
}

app.use('/', routes);
app.use(notFoundMiddleware);

if (process.env.API_TYPE === 'client') {
  const intentExecutorService = new IntentExecutorService(firebase);

  setTimeout(() => {
    const intentsCollection = collection(firebase, 'intents');
    
    onSnapshot(intentsCollection, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          console.log('New intent registered: ', change.doc.data());
          await intentExecutorService.executeIntent(change.doc.data() as ExecuteIntent);
          await deleteDoc(change.doc.ref);
          // Handle the new document here
        }
      });
    });
  }, 3000);
}


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
