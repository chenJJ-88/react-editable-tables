import DefaultTheme from 'vitepress/theme';
import ReactDemo from './ReactDemo.vue';
import './react-demo.css';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component('ReactDemo', ReactDemo);
    },
};
