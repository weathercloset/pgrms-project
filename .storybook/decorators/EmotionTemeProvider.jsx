import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import theme from '../../src/styles/theme';

const EmotionThemeProvider = (storyFn) => <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>;

export default EmotionThemeProvider;
