import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdminPage } from './components/AdminPage';
import { pageToUrl } from './components/AdminPage';
import { PageSchema } from './schema';
import './App.css';

function App({ pages, basePath }: { pages: PageSchema[]; basePath: string }) {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          {pages.map((page, index) => (
            <Route
              key={index}
              path={`${basePath}/${pageToUrl(page)}`}
              element={
                <AdminPage
                  pages={pages}
                  selectedPage={page}
                  basePath={basePath}
                  apiURL="http://localhost:3000/"
                />
              }
            />
          ))}
          {pages[0] ? (
            <Route
              path={`${basePath}/*`}
              element={
                <AdminPage
                  pages={pages}
                  selectedPage={pages[0]}
                  basePath={basePath}
                  apiURL="http://localhost:3001/"
                />
              }
            />
          ) : null}
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
