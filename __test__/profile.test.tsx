import { render, act, fireEvent, screen, waitFor} from '@testing-library/react';
import mockRouter from 'next-router-mock';
import Profile from '../pages/profile'
import { store } from '../src/store/store'
import ErrorBoundary from '../src/components/ErrorBoundary'
import Layout from '../src/components/Layout';
import { Provider } from 'react-redux'
import {fetchUserById} from "../src/store/reducers/loginSlice";


jest.mock('next/router', () => require('next-router-mock'));
// This is needed for mocking 'next/link':
jest.mock('next/dist/client/router', () => require('next-router-mock'));
describe('Profile', () => {
    
  beforeEach(async() => {
    await  act(async() => {
      const state = store.getState().login
      const result = await store.dispatch(fetchUserById(1))
     });
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
    mockRouter.setCurrentUrl("/profile");
  });

  it('Should check profile page is renders on not', async() => {
    render(

        <Provider store={store}>
            <ErrorBoundary>
          <Layout>
            <Profile  />
          </Layout>
          </ErrorBoundary>
        </Provider>
    );
    // await waitFor(() => {
      const text = screen.getByText(`test@fathomable.in`)
       expect(text).toBeInTheDocument()
    // });
  
    // 
     });

   

  
});
