import {Injectable} from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard/default',
        icon: 'feather icon-home',
        classes: 'nav-item',
      }
    ]
  },
  {
    id: 'Management',
    title: 'Management',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Members',
        title: 'Members',
        type: 'item',
        url: '/mgt/members-list',
        icon: 'feather icon-users',
        classes: 'nav-item',
      },
      {
        id: 'Finances',
        title: 'Finances',
        type: 'item',
        url: '/mgt/finance-mgt',
        icon: 'feather icon-file-text',
        classes: 'nav-item',
      },
      {
        id: 'Attendance',
        title: 'Attendance',
        type: 'item',
        url: '/mgt/attendance',
        icon: 'feather icon-user',
        classes: 'nav-item',
      },
      {
        id: 'Tasks',
        title: 'Tasks',
        type: 'item',
        url: '/mgt/premium/tasks',
        icon: 'feather icon-user',
        classes: 'nav-item',
      }
    ]
  },
  // {
  //   id: 'ui-element',
  //   title: 'UI ELEMENT',
  //   type: 'group',
  //   icon: 'icon-ui',
  //   children: [
  //     {
  //       id: 'basic',
  //       title: 'Component',
  //       type: 'collapse',
  //       icon: 'feather icon-box',
  //       children: [
  //         {
  //           id: 'button',
  //           title: 'Button',
  //           type: 'item',
  //           url: '/basic/button'
  //         },
  //         {
  //           id: 'badges',
  //           title: 'Badges',
  //           type: 'item',
  //           url: '/basic/badges'
  //         },
  //         {
  //           id: 'breadcrumb-pagination',
  //           title: 'Breadcrumb & Pagination',
  //           type: 'item',
  //           url: '/basic/breadcrumb-paging'
  //         },
  //         {
  //           id: 'collapse',
  //           title: 'Collapse',
  //           type: 'item',
  //           url: '/basic/collapse'
  //         },
  //         {
  //           id: 'tabs-pills',
  //           title: 'Tabs & Pills',
  //           type: 'item',
  //           url: '/basic/tabs-pills'
  //         },
  //         {
  //           id: 'typography',
  //           title: 'Typography',
  //           type: 'item',
  //           url: '/basic/typography'
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   id: 'forms',
  //   title: 'Forms & Tables',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'forms-element',
  //       title: 'Form Elements',
  //       type: 'item',
  //       url: '/forms/basic',
  //       classes: 'nav-item',
  //       icon: 'feather icon-file-text'
  //     },
  //     {
  //       id: 'tables',
  //       title: 'Tables',
  //       type: 'item',
  //       url: '/tables/bootstrap',
  //       classes: 'nav-item',
  //       icon: 'feather icon-server'
  //     }
  //   ]
  // },
  // {
  //   id: 'chart-maps',
  //   title: 'Chart & Maps',
  //   type: 'group',
  //   icon: 'icon-charts',
  //   children: [
  //     {
  //       id: 'charts',
  //       title: 'Charts',
  //       type: 'item',
  //       url: '/charts/morris',
  //       classes: 'nav-item',
  //       icon: 'feather icon-pie-chart'
  //     }
  //   ]
  // },
  // {
  //   id: 'pages',
  //   title: 'Pages',
  //   type: 'group',
  //   icon: 'icon-pages',
  //   children: [
  //     {
  //       id: 'auth',
  //       title: 'Authentication',
  //       type: 'collapse',
  //       icon: 'feather icon-lock',
  //       children: [
  //         {
  //           id: 'signup',
  //           title: 'Sign up',
  //           type: 'item',
  //           url: '/auth/signup',
  //           target: true,
  //           breadcrumbs: false
  //         },
  //         {
  //           id: 'signin',
  //           title: 'Sign in',
  //           type: 'item',
  //           url: '/auth/signin',
  //           target: true,
  //           breadcrumbs: false
  //         }
  //       ]
  //     },
  //     // {
  //     //   id: 'sample-page',
  //     //   title: 'Sample Page',
  //     //   type: 'item',
  //     //   url: '/sample-page',
  //     //   classes: 'nav-item',
  //     //   icon: 'feather icon-sidebar'
  //     // },
  //     {
  //       id: 'disabled-menu',
  //       title: 'Disabled Menu',
  //       type: 'item',
  //       url: 'javascript:',
  //       classes: 'nav-item disabled',
  //       icon: 'feather icon-power',
  //       external: true
  //     }
  //     // {
  //     //   id: 'buy_now',
  //     //   title: 'Buy Now',
  //     //   type: 'item',
  //     //   icon: 'feather icon-book',
  //     //   classes: 'nav-item',
  //     //   url: 'https://codedthemes.com/item/datta-able-angular/',
  //     //   target: true,
  //     //   external: true
  //     // }
  //   ]
  // },
  {
    id: 'settings',
    title: 'Settings',
    type: 'group',
    icon: 'icon-pages',
    children: [ 
      {
        id: 'users',
        title: 'Users',
        type: 'item',
        url: '/users',
        classes: 'nav-item',
        icon: 'feather icon-user'
      },
      {
        id: 'bulk-sms',
        title: 'Bulk Sms',
        type: 'item',
        url: '/services/bulk-sms',
        classes: 'nav-item',
        icon: 'feather icon-server'
      },
      {
        id: 'payment',
        title: 'Payment',
        type: 'item',
        url: '/services/payment',
        classes: 'nav-item',
        icon: 'feather icon-file-text'
      },
      {
        id: 'subscription',
        title: 'Subscription',
        type: 'item',
        url: '/services/plan/subscription',
        classes: 'nav-item',
        icon: 'feather icon-check-circle'
      },
      // {
      //   id: 'disabled-menu',
      //   title: 'Disabled Menu',
      //   type: 'item',
      //   url: 'javascript:',
      //   classes: 'nav-item disabled',
      //   icon: 'feather icon-power',
      //   external: true
      // }
    ]
  }
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
