import { Request, Response, Router } from 'express';
import authRoute from './auth.route';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  console.log(req.user);
  res.status(200).json({ message: 'Hello World!' });
});
router.use('/auth', authRoute);

if (process.env.API_TYPE === 'client') {
  import('./user.route').then((userRoute) => {
    router.use('/users', userRoute.default);
  });

  import('./color.route').then((colorRoute) => {
    router.use('/color', colorRoute.default);
  });
} else {
  import('./google-home.route').then((googleHomeRoute) => {
    router.use('/google-home', googleHomeRoute.default);
  });
}

export default router;
