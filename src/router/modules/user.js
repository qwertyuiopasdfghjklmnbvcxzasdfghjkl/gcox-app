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
	  path: '/rule',
	  name: 'rule',
	  component: () => import('@/views/register-rule')
	},
	{
	  path: '/verify',
	  name: 'verify',
	  component: () => import('@/views/emailVerify')
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
