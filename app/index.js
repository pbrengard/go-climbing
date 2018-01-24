import React from 'react';
import ReactDOM from 'react-dom';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { green } from 'material-ui/colors';

import App from './App';


const theme = createMuiTheme(
);

ReactDOM.render(<MuiThemeProvider theme={theme}><App /></MuiThemeProvider>, document.getElementById('root'));

//ReactDOM.render(<App />, document.getElementById('root'));
