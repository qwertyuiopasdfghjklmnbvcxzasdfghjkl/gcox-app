export default [
    {
        path: '/market/kline/:market?',
        name: 'kline',
        component: () => import('@/views/exchange/kline'),
    },
    {
        path: '/market',
        name: 'market',
        component: () => import('@/views/market'),
        meta: {nav: true}
    },
    {
        path: '/market/exchange/:market?',
        name: 'exchange',
        component: () => import('@/views/exchange/exchange'),
        meta: {nav: true}
    },
    {
        path: '/market/now-deal',
        name: 'now-deal',
        component: () => import('@/views/exchange/now-deal'),
        meta: {login: true}
    },
    {
        path: '/market/history-deal',
        name: 'history-deal',
        component: () => import('@/views/exchange/history-deal'),
        meta: {login: true}
    },
    {
        path: '/market/entrustDetail/:orderBookId?',
        name: 'entrustDetail',
        component: () => import('@/views/market/entrustDetail'),
    },
    {
        path: '/market/search',
        name: 'search',
        component: () => import('@/views/market/search'),
    },
]
