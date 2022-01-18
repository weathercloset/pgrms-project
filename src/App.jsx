import { ThemeProvider } from '@emotion/react';
import './App.css';
import ContextProviders from './contexts';
import Router from './routes/Router';
import theme from './styles/theme';
import DefaultTemplate from './template/DefaultTemplate';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ContextProviders>
        <DefaultTemplate>
          <Router />
        </DefaultTemplate>
      </ContextProviders>
    </ThemeProvider>
  );
}

export default App;
