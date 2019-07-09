import trading from '@/views/wallet/trading'
import topup from '@/views/wallet/topup'
import withdrawal from '@/views/wallet/withdrawal'

export default [
	{
	  path: '/wallet',
	  name: 'wallet',
	  component: () => import('@/views/wallet'),
	  meta:{login:true,nav:true}
	},
	{
		path: '/trading/:symbol', // 类型 etc btc
		name: trading.name,
		component: trading,
		meta: {login: true}
	},
	{
		path: '/topup/:symbol', // 充值
		name: topup.name,
		component: topup,
		meta: {login: true}
	},
	{
		path: '/withdrawal/:symbol', //
		name: withdrawal.name,
		component: withdrawal,
		meta: {login: true}
	},
]
