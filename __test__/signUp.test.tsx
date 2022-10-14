import { render, act, fireEvent, screen, waitFor} from '@testing-library/react';

import mockRouter from 'next-router-mock';

import Signup from '../pages/signup'
import { store } from '../src/store/store'
import ErrorBoundary from '../src/components/ErrorBoundary'
import Layout from '../src/components/Layout';
import { Provider } from 'react-redux'



jest.mock('next/router', () => require('next-router-mock'));
// This is needed for mocking 'next/link':
jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('Signup', () => {
    
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(), // Deprecated
            removeListener: jest.fn(), // Deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        }))
    });
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() }
    });
    mockRouter.setCurrentUrl("/signup");
  });

  it('Should check login page is renders on not', () => {
    render(

        <Provider store={store}>
            <ErrorBoundary>
          <Layout>
            <Signup  />
          </Layout>
          </ErrorBoundary>
        </Provider>
    );
    const text = screen.getByText('Sign Up')
    expect(text).toBeInTheDocument()
     });

   

  it("Should check renders an error message when submitting the form without a data", async () => {
        const { getByText } = render( <Provider store={store}>
                                  <ErrorBoundary>
                                <Layout>
                                  <Signup  />
                                </Layout>
                                </ErrorBoundary>
                              </Provider>);
      await  act(() => {
                  fireEvent.click(screen.getByText("Submit"));
              
        });
        await waitFor(() => {
          const Emailtext = screen.getByText(/Please enter your email./i);
          expect(Emailtext).toBeInTheDocument();
          const Passwordtext = screen.getByText(/Please input your password./i);
          expect(Passwordtext).toBeInTheDocument();
          const FisrtNametext = screen.getByText(/Please enter your first name./i);
          expect(FisrtNametext).toBeInTheDocument();
          const lastNametext = screen.getByText(/Please enter your last name./i);
          expect(lastNametext).toBeInTheDocument();
          const confirmPasswordtext = screen.getByText(/Please confirm your password./i);
          expect(confirmPasswordtext).toBeInTheDocument();
        });
      
       });
       it("Should be check confirm password ahe password are equal or not", async () => {
            const { container } =  render( <Provider store={store}>
                                              <ErrorBoundary>
                                                <Layout>
                                                  <Signup  />
                                                </Layout>
                                            </ErrorBoundary>
                                          </Provider>);
          await  act( async() => {
                  fireEvent.input(screen.getByTestId("email-test"), {
                    target: { value: "test@fathomable.in" }
                  });
                  fireEvent.input(screen.getByTestId("firstName-test"), {
                    target: { value: "test" }
                  });
                  fireEvent.input(screen.getByTestId("lastName-test"), {
                    target: { value: "test" }
                  });
                  fireEvent.input(screen.getByTestId("password-test"), {
                    target: { value: "123412346" }
                  });
                  fireEvent.input(screen.getByTestId("confirmpassword-test"), {
                    target: { value: "1234123465" }
                  });

                 fireEvent.click(screen.getByTestId("submit-signup"));
            });
           
            await waitFor(() => {
                const confirmPasswordtext = screen.getByText(/The two passwords that you entered do not match!/i);
                expect(confirmPasswordtext).toBeInTheDocument();
            });
          
           });      

       it("Should Signup submitted successfully", async () => {
        const { container } =  render( <Provider store={store}>
                                          <ErrorBoundary>
                                            <Layout>
                                              <Signup  />
                                            </Layout>
                                        </ErrorBoundary>
                                      </Provider>);
      await  act( async() => {
                fireEvent.input(screen.getByTestId("email-test"), {
                    target: { value: "test@fathomable.in" }
                });
                fireEvent.input(screen.getByTestId("firstName-test"), {
                    target: { value: "test" }
                });
                fireEvent.input(screen.getByTestId("lastName-test"), {
                    target: { value: "test" }
                });
                fireEvent.input(screen.getByTestId("password-test"), {
                    target: { value: "1234123465" }
                });
                fireEvent.input(screen.getByTestId("confirmpassword-test"), {
                    target: { value: "1234123465" }
                });

                fireEvent.click(screen.getByTestId("submit-signup"));
        });
       
        await waitFor(() => {
          expect(container.getElementsByClassName("ant-form-item-explain-error").length).toBe(0);
        });
      
       });      
});
