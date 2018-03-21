import React from 'react';
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import { generateMenu, topNav, RedirectRoute } from 'common/nav';
import { NotFoundPage } from 'routes';
import './basicLayout.scss';

require('core-js');

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;


class HighComponent extends React.PureComponent {
  /**
   * 渲染侧边栏
   */
  getMenuList = (menus, parentPath = '') => {
    if (!menus) {
      return [];
    }
    return menus.map((item) => {
      if (!item.name) {
        return null;
      }
      let itemPath;
      if (item.path.indexOf('http') === 0) {
        itemPath = item.path;
      } else {
        itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
      }

      if (item.children && item.children.some(child => child.name)) {
        return (
          <SubMenu
            key={item.path}
            title={item.icon ? (<span><Icon type={item.icon} /><span>{item.name}</span></span>) : item.name}
          >
            { this.getMenuList(item.children, itemPath) }
          </SubMenu>
        );
      }
      const icon = item.icon && <Icon type={item.icon} />;
      return (
        <Menu.Item key={item.path}>
          {
            /^http?:\/\//.test(itemPath) ? (
              <a href={itemPath}>
                {icon}<span>{item.name}</span>
              </a>
            ) : (
              <Link
                to={itemPath}
                target={item.target}
                replace={itemPath === this.props.location.pathname}
              >
                {icon}<span>{item.name}</span>
              </Link>
            )
          }
        </Menu.Item>
      );
    });
  }

  getCurrentMenuSelectedKeys = () => {
    const { location: { pathname } } = this.props;
    const keys = pathname.split('/').slice(1);
    if (keys.length === 1 && keys[0] === '') {
      return [this.state.menus[0].key];
    }
    return keys;
  }
}

export default class BasicLayout extends HighComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      manageNav: true,
      menus: generateMenu('manage'),
      menuOpenKeys: [],
    };
    this.defaultSelectedKeys = 'manage';
  }

  /**
   * 通过当前的url判断顶层nav是显示数据管理还是数据洞察
   * 判断地址栏的内容，刷新的时候能够展开侧边栏对应的menu
   */
  componentWillMount() {
    const { location: { pathname } } = this.props;
    if (pathname.includes('/analysis/')) {
      this.setState({
        manageNav: false,
        menus: generateMenu('insight'),
      });
      this.defaultSelectedKeys = 'insight';
    }

    const keys = pathname.split('/').slice(1);
    let key = ['quality'];
    if (keys.length > 0) {
      key = [keys[0]];
    }
    this.setState({
      menuOpenKeys: key,
    });
  }

  componentDidMount() {
    console.log(this.props);
  }

  componentWillUnmount() {
    this.setState({
      menuOpenKeys: [],
    });
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  /**
   * 点击顶层nav修改侧边栏内容
   */
  changeNav = ({ key }) => {
    if (key) {
      let nav = true;
      let openKeys = ['quality'];
      if (key === 'insight') {
        nav = false;
        openKeys = ['analysis'];
      }
      this.setState({
        manageNav: nav,
        menus: generateMenu(key),
        menuOpenKeys: openKeys,
      });
    }
  }

  /**
   * 点击侧边栏时openKeys修改
   */
  menuOpenChange = (openKeys) => {
    this.setState({
      menuOpenKeys: openKeys,
    });
  }

  render() {
    const { getManageRouteData, getInsightRouteData } = this.props;
    const topMenu = [];

    if (topNav && topNav.length) {
      topNav.forEach((element) => {
        topMenu.push(
          <Menu.Item key={element.key}>
            <Link
              to={element.itemPath}
            >
              {element.val}
            </Link>
          </Menu.Item>);
      });
    }

    /**
     * 重定向路由
     * @param {array} data
     */
    const getRedirectRoute = (data) => {
      if (data && data.length) {
        const routes = [];
        data.forEach((val) => {
          if (val) {
            routes.push(<Route exact path={val.path} key={val.path} render={() => <Redirect to={val.to} />} />);
          }
        });
        return routes;
      }
      return '';
    };

    return (
      <div className="basic_layout" id="components-layout-demo-custom-trigger">
        <Layout>
          <Header className="basic_header">
            <Layout style={{ background: '#001529' }}>
              <Sider
                className="basic_sider"
                width={204}
                collapsible
                trigger={null}
                collapsed={this.state.collapsed}
              >
                {/* <div className="logo">
                  <img src={logo} alt="4399数据平台" className="logo_img" />
                  <span className="logo_word">4399数据平台</span>
                </div> */}
              </Sider>
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[this.defaultSelectedKeys]}
                className="basic_header_menu"
                style={{ lineHeight: '64px' }}
                onClick={this.changeNav}
              >
                {topMenu}
              </Menu>
            </Layout>
          </Header>
          <Layout className="basic_content">
            <Sider
              style={{ minHeight: 'calc(100vh - 64px)' }}
              className="basic_sider"
              width={256}
              collapsible
              trigger={null}
              collapsed={this.state.collapsed}
            >
              <Menu mode="inline" selectedKeys={this.getCurrentMenuSelectedKeys()} openKeys={this.state.menuOpenKeys} onOpenChange={this.menuOpenChange}>
                {this.getMenuList(this.state.menus)}
              </Menu>
            </Sider>
            <Content>
              <Switch>
                {getRedirectRoute(RedirectRoute)}
                { this.state.manageNav ?
                  (getManageRouteData('BasicLayout').map(item => (
                    <Route
                      exact={item.exact}
                      key={item.path}
                      path={item.path}
                      component={item.component}
                    />
                ))) : (getInsightRouteData('BasicLayout').map(item => (
                  <Route
                    exact={item.exact}
                    key={item.path}
                    path={item.path}
                    component={item.component}
                  />
                )))
                }
                <Route component={NotFoundPage} />
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
