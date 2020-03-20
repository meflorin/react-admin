import React, { Component } from 'react';
import { Admin, Resource } from 'react-admin';

import authProvider from './authProvider';
import themeReducer from './themeReducer';
import { Login, Layout } from './layout';
import customRoutes from './routes';
import englishMessages from './i18n/en';
 

import posts from './posts';

import myRestProvider from './myRestProvider';

const i18nProvider = locale => {
    if (locale === 'fr') {
        return import('./i18n/fr').then(messages => messages.default);
    }

    // Always fallback on english
    return englishMessages;
};

class App extends Component {
    state = { dataProvider: null };

    render() {        
        return (
            <Admin
                title=""
                dataProvider={myRestProvider}
                //dataProvider={simpleRestProvider(apiURL)}
                customReducers={{ theme: themeReducer }}                
                customRoutes={customRoutes}
                authProvider={authProvider}                
                loginPage={Login}
                appLayout={Layout}
                locale="en"
                i18nProvider={i18nProvider}
            >
             
                <Resource name="posts" {...posts} />

            </Admin>
        );
    }
}

export default App;
