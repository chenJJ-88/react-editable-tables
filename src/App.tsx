import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import Router from './components/Router';
import './App.css';

const App: React.FC = () => {
    return (
        <ConfigProvider locale={zhCN}>
            <Router />
        </ConfigProvider>
    );
};

export default App;

