import { render, act, fireEvent, screen, waitFor} from '@testing-library/react';
import mockRouter from 'next-router-mock';
import Login from '../pages/login'
import { store } from '../src/store/store'
import ErrorBoundary from '../src/components/ErrorBoundary'
import Layout from '../src/components/Layout';
import { Provider } from 'react-redux'



jest.mock('next/router', () => require('next-router-mock'));
// This is needed for mocking 'next/link':
jest.mock('next/dist/client/router', () => require('next-router-mock'));
describe('Login', () => {
    
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
    mockRouter.setCurrentUrl("/login");
  });

  it('Should check login page is renders on not', () => {
    render(

        <Provider store={store}>
            <ErrorBoundary>
          <Layout>
            <Login  />
          </Layout>
          </ErrorBoundary>
        </Provider>
    );
    const text = screen.getByText('Sign In')
    expect(text).toBeInTheDocument()
     });

   

  it("Should check renders an error message when submitting the form without a email and password", async () => {
        const { getByText } = render( <Provider store={store}>
                                  <ErrorBoundary>
                                <Layout>
                                  <Login  />
                                </Layout>
                                </ErrorBoundary>
                              </Provider>);
      await  act(() => {
                  fireEvent.click(screen.getByText("Login"));
              
        });
        await waitFor(() => {
          const Emailtext = screen.getByText(/Please enter your email./i);
          expect(Emailtext).toBeInTheDocument();
          const Passwordtext = screen.getByText(/Please enter your password./i);
          expect(Passwordtext).toBeInTheDocument();
        });
      
       });

       it("Should Login submitted successfully", async () => {
        const { container } =  render( <Provider store={store}>
                                          <ErrorBoundary>
                                            <Layout>
                                              <Login  />
                                            </Layout>
                                        </ErrorBoundary>
                                      </Provider>);
      await  act( async() => {
              fireEvent.input(screen.getByTestId("email-test"), {
                target: { value: "shrusti@fathomable.in" }
              });
              fireEvent.input(screen.getByTestId("password-test"), {
                target: { value: "1234123465" }
              });
             fireEvent.click(screen.getByTestId("submit-login"));
        });
       
        await waitFor(() => {
          expect(container.getElementsByClassName("ant-form-item-explain-error").length).toBe(0);
        });
      
       }); 
});
