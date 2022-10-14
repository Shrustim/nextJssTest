// src/mocks.js
// 1. Import the library.
import {  rest } from 'msw'
import {baseUrl } from "../src/restApi";
import jwt from 'jsonwebtoken';
import {JWTSecret} from "../constants"
// 2. Describe network behavior with request handlers.
export const handlers = [
  rest.post(''+baseUrl+'users/authenticate', (req, res, ctx) => {
    const token = jwt.sign({ sub: 1, "role": "user" }, JWTSecret, { expiresIn: '7d' });
    return res(
      ctx.status(200),
      ctx.json({
        token: token,
      }),
    )
  }),
  rest.post(''+baseUrl+'users/signup', (req, res, ctx) => {
    const token = jwt.sign({ sub: 1, "role": "user" }, JWTSecret, { expiresIn: '7d' });
    return res(
      ctx.status(200),
      ctx.json({
        token: token,
      }),
    )
  }),
  rest.get(''+baseUrl+'users/:userId', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([{
        id: req.params.userId,
        email: 'test@fathomable.in',
        firstName: 'testF',
        lastName: 'testL',
        role: 'user'
      }]),
    )
  }),
  rest.post(''+baseUrl+'company/companiesbyuid', async(req, res, ctx) => {
   return res(
      ctx.status(200),
      ctx.json( [{
        "id": 1,
        "companyName": "test company",
        "contactPerson": "testA",
        "email": "test@fathomable.in",
        "websiteUrl": "www.abc.in",
        "phoneNumber": "741",
        "userId": 1
    },{
      "id": 2,
      "companyName": "testA company two",
      "contactPerson": "testB",
      "email": "testB@fathomable.in",
      "websiteUrl": "www.abc.in",
      "phoneNumber": "741",
      "userId": 1
  }]),
    )
  })
];