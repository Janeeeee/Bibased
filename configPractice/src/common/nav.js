import {
  NotFoundPage,
} from 'routes';
import cloneDeep from 'lodash/cloneDeep';
import BasicLayout from 'layouts/BasicLayout';

export const topNav = [
  {
    val: '数据管理',
    key: 'manage',
    itemPath: '/',
  },
  {
    val: '数据洞察',
    key: 'insight',
    itemPath: '/analysis',
  },
];

export const RedirectRoute = [
  {
    path: '/',
    to: '/quality/exception',
  },
  {
    path: '/quality',
    to: '/quality/exception',
  },
  {
    path: '/analysis',
    to: '/analysis/download',
  },
  {
    path: '/log',
    to: '/log/search',
  },
];

export const manageNav = () => [
  {
    component: BasicLayout,
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '数据质量',
        path: 'quality',
        icon: 'area-chart',
        children: [
          {
            name: '异常数据',
            path: 'exception',
            component: NotFoundPage,
          },
          {
            name: '数据明细',
            path: 'detail',
            component: NotFoundPage,
          },
        ],
      },
      {
        name: '日志管理',
        path: 'log',
        icon: 'file-text',
        children: [
          {
            name: '日志查询',
            path: 'search',
            component: NotFoundPage,
          },
        ],
      },
      {
        name: '测试工具',
        path: 'test-tools',
        icon: 'tool',
        component: NotFoundPage,
      },
      {
        name: '数据定义',
        path: 'data-define',
        icon: 'database',
        component: NotFoundPage,
      },
    ],
  },
];

export const insightNav = () => [
  {
    component: BasicLayout,
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '多维分析',
        path: 'analysis',
        icon: 'line-chart',
        children: [
          {
            name: '游戏下载',
            path: 'download',
            component: NotFoundPage,
          },
        ],
      },
    ],
  },
];

export const generateMenu = (nav) => {
  let navData = manageNav();
  if (nav === 'insight') {
    navData = insightNav();
  }
  return navData.reduce((arr, current) => arr.concat(current.children), []);
};

export const getPlainNode = (nodeList, parentPath = '') => {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  console.log(arr);
  return arr;
};

export const getRouteData = (navData, path) => {
  console.log(path);
  if (!navData.some(item => item.layout === path) ||
    !(navData.filter(item => item.layout === path)[0].children)) {
    return null;
  }
  const route = cloneDeep(navData.filter(item => item.layout === path)[0]);
  const nodeList = getPlainNode(route.children);
  return nodeList;
};
