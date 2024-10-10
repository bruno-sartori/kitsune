import { Request, Response, Router } from 'express';
import authRoute from './auth.route';
import deviceRoute from './device.route';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  console.log(req.user);
  res.status(200).json({ message: 'Hello World!' });
});
router.use('/auth', authRoute);
router.use('/device', deviceRoute);

if (process.env.API_TYPE === 'client') {
  import('./user.route').then((userRoute) => {
    router.use('/users', userRoute.default);
  });
} else {
  import('./google-home.route').then((googleHomeRoute) => {
    router.use('/google-home', googleHomeRoute.default);
  });
}

export default router;
