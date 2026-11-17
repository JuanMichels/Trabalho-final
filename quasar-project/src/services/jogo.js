// import { api } from '@/boot/axios'

// async function getJogo() {
//   const response = await api.get('/jogo')
//   return response.data
// }

// export { getJogo }

import { api } from '@/boot/axios'

export async function getJogo() {
  const response = await api.get('/jogo')
  const payload = response.data
  const jogos = Array.isArray(payload)
    ? payload
    : (payload?.data?.rows ?? payload?.data)

  if (!Array.isArray(jogos)) {
    throw new Error('A API não retornou uma lista de jogos.')
  }

  return jogos
}
export async function cadastrarJogo(jogo) {
  const response = await api.post('/jogo', jogo)
  return response.data
}
