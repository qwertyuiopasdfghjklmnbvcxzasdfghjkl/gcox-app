// import My from '@/views/my/index'

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
                component:() => import('@/views/my/safety'),
                meta:{login: true}
            },
            {
                path: 'changePassword',
                name: 'changePassword',
                component:() => import('@/views/my/change-password'),
                meta:{login: true}
            },
            {
                path: 'changePaymentPassword',
                name: 'changePaymentPassword',
                component:() => import('@/views/my/change-payment-password'),
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
            }
            
        ]
    },
]
