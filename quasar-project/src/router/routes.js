const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: 'Index', component: () => import('@/pages/IndexPage.vue') },
      { path: 'jogos', component: () => import('@/pages/jogoPage.vue') },
      { path: 'jogos/:id', component: () => import('@/pages/JogoDetalhesPage.vue') },
      { path: 'cadastrar-jogos', component: () => import('@/pages/CadastrarJogoPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue')
  }
]

export default routes
