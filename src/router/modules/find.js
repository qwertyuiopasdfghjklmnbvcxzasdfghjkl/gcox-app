export default [
	{
	  path: '/init/',
	  name: 'init',
	  component: () => import('@/views/init'),
	},
	{
	  path: '/find/myDapps',
	  name: 'myDapps',
	  component: () => import('@/views/find/myDapps'),
	  meta:{login:true}
	},
	{
	  path: '/find/myFavorites',
	  name: 'myFavorites',
	  component: () => import('@/views/find/myFavorites'),
	  meta:{login:true}
	},
	{
	  path: '/find/dappDetail/:gameId',
	  name: 'dappDetail',
	  component: () => import('@/views/find/dappDetail')
	},
	{
	  path: '/find/search',
	  name: 'dappsSearch',
	  component: () => import('@/views/find/search')
	},
	{
	  path: '/find/gameSupport/:gameId',
	  name: 'gameSupport',
	  component: () => import('@/views/find/gameSupport'),
	  meta:{login:true}
	}
]
