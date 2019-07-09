export default [
	{
	  path: '/market/kline/:market?',
	  name: 'kline',
	  component: () => import('@/views/market/kline'),
	},
	{
	  path: '/market',
	  name: 'market',
	  component: () => import('@/views/market'),
	  meta:{nav:true}
	},
	{
	  path: '/market/exchange/:market?',
	  name: 'exchange',
	  component: () => import('@/views/market/exchange'),
	},
	{
	  path: '/market/entrustDetail/:orderBookId?',
	  name: 'entrustDetail',
	  component: () => import('@/views/market/entrustDetail'),
	},
]
