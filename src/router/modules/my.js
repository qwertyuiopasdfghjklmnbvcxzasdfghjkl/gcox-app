// import My from '@/views/my/index'
import trading from '@/views/my/wallet/trading'
import topup from '@/views/my/wallet/topup/topup'
import withdrawal from '@/views/my/wallet/withdrawal/withdrawal'
import withdrawalSelect from '@/views/my/wallet/withdrawal/withdrawal-select'
import addressManage from '@/views/my/wallet/address/address-manage'
import address from '@/views/my/wallet/address/address'
import addAddress from '@/views/my/wallet/address/add-address'
import topupSelect from '@/views/my/wallet/topup/topup-select'
import walletDetail from '@/views/my/wallet/wallet-detail'

export default [
    {
        path: '/ucenter',
        name: 'my',
        redirect: '/ucenter/index',
        component:() => import('@/views/my'),
        children:[
            {
                path: 'index',
                name: 'ucenter',
                component:() => import('@/views/my/my'),
                meta:{nav:true, login:true}
            },
            {
                path: 'realName',
                name: 'realName',
                component:() => import('@/views/my/real-name'),
                meta:{login: true}
            },
            {
                path: 'message',
                name: 'message',
                component:() => import('@/views/my/message'),
                meta:{login: true}
            },
            {
                path: 'set',
                name: 'set',
                component:() => import('@/views/my/set'),
            },
            {
                path: 'setLang',
                name: 'setLang',
                component:() => import('@/views/my/set-lang'),
            },
            {
                path: 'safe',
                name: 'safe',
                component:() => import('@/views/my/safe/safety'),
                meta:{login: true}
            },
            {
                path: 'google-verify',
                name: 'google-verify',
                component:() => import('@/views/my/safe/google-verify'),
                meta:{login: true}
            },
            {
                path: 'resetPW',
                name: 'resetPW',
                component:() => import('@/views/my/safe/reset-password'),
                meta:{login: true}
            },
            {
                path: 'set-payPW',
                name: 'set-payPW',
                component:() => import('@/views/my/safe/set-payPW'),
                meta:{login: true}
            },
            {
                path: 'noteVerif',
                name: 'noteVerif',
                component:() => import('@/views/my/note-verif'),
                meta:{login: true}
            },
            {
                path: 'help',
                name: 'help',
                component:() => import('@/views/my/help'),
            },
            {
                path: 'about',
                name: 'about',
                component:() => import('@/views/my/about'),
            },
            {
                path: 'center',
                name: 'center',
                component:() => import('@/views/my/center'),
            },
            {
                path: 'wallet',
                name: 'wallet',
                component: () => import('@/views/my/wallet'),
                meta:{
                    login:true,
                    nav:true
                }
            },
            {
                path: 'trading',
                name: 'trading',
                component: trading,
                meta: {login: true}
            },
            {
                path: 'wallet-detail',
                name: 'wallet-detail',
                component: walletDetail,
                meta: {login: true}
            },
            {
                path: 'address-manage',
                name: 'address-manage',
                component: addressManage,
                meta: {login: true}
            },
            {
                path: 'address',
                name: 'address',
                component: address,
                meta: {login: true}
            },
            {
                path: 'add-address',
                name: 'add-address',
                component: addAddress,
                meta: {login: true}
            },
            {
                path: 'topup-select', // 选择充值
                name: 'topup-select',
                component: topupSelect,
                meta: {login: true}
            },
            {
                path: 'topup', // 充值
                name: topup.name,
                component: topup,
                meta: {login: true}
            },
            {
                path: 'withdrawal-select', //
                name: 'withdrawal-select',
                component: withdrawalSelect,
                meta: {login: true}
            },
            {
                path: 'withdrawal', //
                name: 'withdrawal',
                component: withdrawal,
                meta: {login: true}
            },
            {
                path: 'wallet/history',
                name: 'history',
                component: () => import('@/views/my/wallet/history/history-list'),
                meta:{login:true}
            }
        ]
    },
]
