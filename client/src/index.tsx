import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import AppRouter from './components/AppRouter';
import log from 'loglevel';

// log.setLevel('trace');
log.setLevel('error');

ReactDOM.render(
    <React.StrictMode>
        <AppRouter />
    </React.StrictMode>,
    document.getElementById('root'),
);
