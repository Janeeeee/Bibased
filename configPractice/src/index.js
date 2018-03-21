import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/promise';
// import 'raf/polyfill';
import 'common/basic';
import React from 'react';
import ReactDOM from 'react-dom';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import models from './models';
import Layouts from './layouts/BasicLayout';
import { Provider } from 'mobx-react';
import { Route, HashRouter } from 'react-router-dom';
import { LocaleProvider, DatePicker, message } from 'antd';
import { insightNav, manageNav, getRouteData } from 'common/nav';

if (module.hot) {
  module.hot.accept();
}

class App extends React.Component {
  render() {
    const manageNavData = manageNav();
    const insightNavData = insightNav();
    const storeProps = {
      getManageRouteData: (path) => {
        return getRouteData(manageNavData, path);
      },
      getInsightRouteData: (path) => {
        return getRouteData(insightNavData, path);
      },
    };

    return (
      <Provider {...models}>
        <LocaleProvider locale={zhCN}>
          <HashRouter>
            <Route path="/" render={props => <Layouts {...props} {...storeProps} />} />
          </HashRouter>
        </LocaleProvider>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));