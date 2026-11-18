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

  return jogos.map((jogo) => ({
    ...jogo,
    imagem: jogo.imagem ? new URL(jogo.imagem, api.defaults.baseURL).href : null
  }))
}
export async function cadastrarJogo(jogo) {
  const response = await api.post('/jogo', jogo)
  return response.data
}

export async function getAvaliacoes() {
  const response = await api.get('/avaliacao')
  const payload = response.data
  const avaliacoes = Array.isArray(payload)
    ? payload
    : (payload?.data?.rows ?? payload?.data)

  return Array.isArray(avaliacoes) ? avaliacoes : []
}

export async function cadastrarAvaliacao(dados) {
  const response = await api.post('/avaliacao', dados)
  return response.data
}

export async function atualizarAvaliacao(id, dados) {
  const response = await api.put(`/avaliacao/${id}`, dados)
  return response.data
}

export async function deletarAvaliacao(id) {
  const response = await api.delete(`/avaliacao/${id}`)
  return response.data
}

export async function atualizarJogo(id, dados) {
  const response = await api.put(`/jogo/${id}`, dados)
  return response.data
}

export async function deletarJogo(id) {
  const response = await api.delete(`/jogo/${id}`)
  return response.data
}
