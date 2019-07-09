export default [
	{
	  path: '/login',
	  name: 'login',
	  component: () => import('@/views/login')
	},
	{
	  path: '/register',
	  name: 'register',
	  component: () => import('@/views/register')
	},
	{
	  path: '/register/paymentSet',
	  name: 'paymentSet',
	  component: () => import('@/views/paymentSet')
	},
	{
	  path: '/findpwd',
	  name: 'findpwd',
	  component: () => import('@/views/findPwd')
	},
	{
	  path: '/twoverify',
	  name: 'twoverify',
	  component: () => import('@/views/twoverify')
	},
]