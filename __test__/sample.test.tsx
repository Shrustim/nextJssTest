import singletonRouter, { useRouter } from 'next/router';
import NextLink from 'next/link';
import { render, act, fireEvent, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import mockRouter from 'next-router-mock';

import Login from '../pages/login'
import { store } from '../src/store/store'
import ErrorBoundary from '../src/components/ErrorBoundary'
import Layout from '../src/components/Layout';
import { Provider } from 'react-redux'

jest.mock('next/router', () => require('next-router-mock'));
// This is needed for mocking 'next/link':
jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('next-router-mock', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/initial");
  });

  it('supports `push` and `replace` methods', () => {
    singletonRouter.push('/foo?bar=baz');
    expect(singletonRouter).toMatchObject({
      asPath: '/foo?bar=baz',
      pathname: '/foo',
      query: { bar: 'baz' },
    });
  });

  it('supports URL objects with templates', () => {
    singletonRouter.push({
      pathname: '/[id]/foo',
      query: { id: '123', bar: 'baz' },
    });
    expect(singletonRouter).toMatchObject({
      asPath: '/123/foo?bar=baz',
      pathname: '/[id]/foo',
      query: { bar: 'baz' },
    });
  });

//   it('mocks useRouter', () => {
//     const { result } = renderHook(() => {
//       return useRouter();
//     });
//     expect(result.current).toMatchObject({ asPath: "/initial" });
//     act(() => {
//       result.current.push("/example");
//     });
//     expect(result.current).toMatchObject({ asPath: "/example" })
//   });

const Component = () => {
    const router = useRouter();

  return (
    <button type="button" onClick={() => router.push('/about')}>
      Click me
    </button>
  )
}
  it('works with next/link', () => {
    render(

      <Component/>
    );
    const text = screen.getByText('Click me')
    expect(text).toBeInTheDocument()
    //  fireEvent.click(screen.getByText('Example Link'));
    // expect(singletonRouter).toMatchObject({ asPath: '/example?foo=bar' });
  });

//   it('supports `push` and `replace` methods', () => {
//     singletonRouter.push('/foo?bar=baz');
//     expect(singletonRouter).toMatchObject({
//       asPath: '/foo?bar=baz',
//       pathname: '/foo',
//       query: { bar: 'baz' },
//     });
//   });









      // it("check Login form with wrong credentials", async () => {
      //   const { getByText } = render( <Provider store={store}>
      //                             <ErrorBoundary>
      //                           <Layout>
      //                             <Login  />
      //                           </Layout>
      //                           </ErrorBoundary>
      //                         </Provider>);
      // await  act( async() => {
      //         fireEvent.input(screen.getByTestId("email-test"), {
      //           target: { value: "shrusti@fathomable.in" }
      //         });
      //         fireEvent.input(screen.getByTestId("password-test"), {
      //           target: { value: "1234123465" }
      //         });
      //        fireEvent.click(screen.getByTestId("submit-login"));
            
            
      //   });
      //   const a = await mockedAxios.post.mockRejectedValue({
      //     status : 404,message:"Email or password is incorrect",
      //   }
      //     // new Promise( (resolve, reject) =>  {
      //     //   reject("Email or password is incorrect");
      //     // }
      //       // {
      //     // status : 404,message:"Email or password is incorrect",
      //     // response:{
      //     //   message:"Email or password is incorrect",
      //     // }
      //     // response: {
      //     //   request:{ response:"Email or password is incorrect"}
      //     // }
      //   // }
      //   // )
      //   );
         // mockedAxios.post.mockResolvedValue(
        //   // new Promise( (resolve, reject) =>  {
        //   //   reject("Email or password is incorrect");
        //   // })
        //    {
        //   status : 404,message:"Email or password is incorrect",
        //   response:{
        //     message:"Email or password is incorrect",
        //   }}
        //   )
        // mockedAxios.post.mockImplementationOnce(() =>
        //   Promise.reject(new Error("Email or password is incorrect"))
        // );
        // axios.post("", {
        //   email:"aaa@gmail.com",
        //   password:"123412345"
        // }).then(function (response) {

        // }) .catch(function (err) {
        //   // reject("Email or password is incorrect");
        // });
        // const a = await mockedAxios.mockResolvedValue({
        //   data:{
        //     token:"aaaaaaaaaaaaaaaaaaaaaaaaaaa"
        //   }
        // }
          // new Promise( (resolve, reject) =>  {
          //   reject("Email or password is incorrect");
          // }
            // {
          // status : 404,message:"Email or password is incorrect",
          // response:{
          //   message:"Email or password is incorrect",
          // }
          // response: {
          //   request:{ response:"Email or password is incorrect"}
          // }
        // }
        // )
        // );
        
      //   await waitFor(() => {
      //     // const Emailtext = screen.getByText(/Please enter your email./i);
      //     // expect(Emailtext).toBeInTheDocument();
      //     const credentialsError = screen.getByText(/Cannot read properties of undefined /i);
      //     expect(credentialsError).toBeInTheDocument();
      //   });
      
      //   // await waitForElement(() => getByText(/username required/i));
      // });


});
