import { render, act, fireEvent, screen, waitFor} from '@testing-library/react';
import mockRouter from 'next-router-mock';
import CompanyList from '../../pages/company/index'
import { store } from '../../src/store/store'
import ErrorBoundary from '../../src/components/ErrorBoundary'
import Layout from '../../src/components/Layout';
import { Provider } from 'react-redux'
import {fetchUserById} from "../../src/store/reducers/loginSlice";


jest.mock('next/router', () => require('next-router-mock'));
// This is needed for mocking 'next/link':
jest.mock('next/dist/client/router', () => require('next-router-mock'));
describe('Company', () => {
    
  beforeEach(async() => {
      await  act(async() => {
       
        const result = await store.dispatch(fetchUserById(1))
        const state = store.getState().login
        console.log("----------------state ",state)
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
    mockRouter.setCurrentUrl("/company");
  });

  it('Should check company\'s list is renders on not', async () => {
   
    render(

        <Provider store={store}>
            <ErrorBoundary>
          <Layout>
            <CompanyList  />
          </Layout>
          </ErrorBoundary>
        </Provider>
    );
    await waitFor(() => {
      const text = screen.getByText('Company List')
      expect(text).toBeInTheDocument()
    });
  
  
     });

  it('Should be able to fetch the companies list for a specific user', async () => {
   
    render(

        <Provider store={store}>
            <ErrorBoundary>
          <Layout>
            <CompanyList  />
          </Layout>
          </ErrorBoundary>
        </Provider>
    );
    await waitFor(() => {
      const text = screen.getByText('test company')
      expect(text).toBeInTheDocument()
    });
  
  
     });

   

  
});
