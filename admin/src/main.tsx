import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { users } from './testSchemas/users';
import { produse } from './testSchemas/produse';
import { categorii } from './testSchemas/categorii';
import { comenzi } from './testSchemas/comenzi';
import { recenzie } from './testSchemas/recenzii';
import { inventar } from './testSchemas/inventar';
import { specificatii } from './testSchemas/specificatii';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App
      pages={[users, produse, categorii, comenzi, recenzie, inventar, specificatii]}
      basePath=""
    />
  </React.StrictMode>,
);
