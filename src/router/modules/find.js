export default [
	{
	  path: '/init/',
	  name: 'init',
	  component: () => import('@/views/init'),
	},
	{
		path: '/notice',
		name: 'notice',
		component: () => import('@/views/find/notice/notice-list')
	},
	{
		path: '/notice-detail',
		name: 'notice-detail',
		component: () => import('@/views/find/notice/notice-detail')
	}
]
