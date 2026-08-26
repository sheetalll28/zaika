import { Router } from 'express';

import { login, signup } from './../controllers/auth';
import {validate } from './../middlewares'
import { joinSchema, loginSchema } from '../routes/schema-validations';
import { asyncHandler} from './../utils/asyncHandler';

const router = Router();

router.post('/signup', validate(joinSchema), asyncHandler(signup));
router.post('/login', validate(loginSchema), asyncHandler(login));

export { router };

