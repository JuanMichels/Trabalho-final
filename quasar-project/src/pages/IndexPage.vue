<template>
  <q-page class="pagina-inicial">
    <main class="conteudo">
      <section class="destaque">
        <div>
          <p class="subtitulo">ALL GAME COME</p>
          <h1>Os jogos mais bem avaliados</h1>
          <p class="descricao">
            Confira os títulos com as maiores médias da comunidade.
          </p>
          <q-btn color="primary" label="Ver todos os jogos" to="/jogos" />
        </div>
      </section>

      <div v-if="carregando" class="mensagem">
        <q-spinner color="blue" size="45px" />
        <p>Carregando jogos...</p>
      </div>

      <div v-else-if="erro" class="mensagem">
        <q-icon name="error_outline" size="40px" />
        <p>Não foi possível carregar os jogos e as avaliações.</p>
        <q-btn label="Tentar novamente" color="primary" @click="carregarDestaques" />
      </div>

      <section v-else-if="topJogos.length">
        <div class="titulo-secao">
          <h2>Top 5 jogos</h2>
          <span>Ordenados pela média das notas</span>
        </div>

        <div class="grade-jogos">
          <q-card
            v-for="jogo in topJogos"
            :key="jogo.id"
            class="card-jogo"
            flat
            :style="estiloFundo(jogo.imagem)"
            role="button"
            tabindex="0"
            :aria-label="`Abrir detalhes de ${jogo.nome}`"
            @click="abrirJogo(jogo.id)"
            @keyup.enter="abrirJogo(jogo.id)"
            @keyup.space.prevent="abrirJogo(jogo.id)"
          >
            <q-card-section class="informacoes">
              <div class="nota-jogo">
                <q-icon name="star" color="amber" />
                {{ jogo.media.toFixed(1) }}/10
              </div>
              <div class="nome-jogo">{{ jogo.nome }}</div>
              <div class="descricao-jogo">{{ jogo.resumo }}</div>
            </q-card-section>
          </q-card>
        </div>
      </section>

      <div v-else class="mensagem">
        <q-icon name="star_border" size="45px" />
        <p>Nenhum jogo possui avaliações ainda.</p>
      </div>
    </main>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAvaliacoes, getJogo } from '@/services/jogo.js'

const router = useRouter()
const jogos = ref([])
const avaliacoes = ref([])
const carregando = ref(false)
const erro = ref(false)

const topJogos = computed(() => {
  const totais = new Map()

  avaliacoes.value.forEach((avaliacao) => {
    const nota = Number(avaliacao.nota)
    if (!Number.isFinite(nota)) return

    const id = String(avaliacao.jogo_id)
    const total = totais.get(id) || { soma: 0, quantidade: 0 }
    total.soma += nota
    total.quantidade += 1
    totais.set(id, total)
  })

  return jogos.value
    .map((jogo) => {
      const total = totais.get(String(jogo.id))
      return total
        ? { ...jogo, media: total.soma / total.quantidade }
        : null
    })
    .filter(Boolean)
    .sort((a, b) => b.media - a.media || Number(a.id) - Number(b.id))
    .slice(0, 5)
})

function estiloFundo(imagem) {
  return {
    backgroundImage: imagem ? `url("${imagem}")` : 'none'
  }
}

function abrirJogo(id) {
  router.push(`/jogos/${id}`)
}

async function carregarDestaques() {
  carregando.value = true
  erro.value = false

  try {
    const [listaJogos, listaAvaliacoes] = await Promise.all([
      getJogo(),
      getAvaliacoes()
    ])
    jogos.value = listaJogos
    avaliacoes.value = listaAvaliacoes
  } catch (error) {
    console.error('Erro ao carregar os jogos mais bem avaliados:', error)
    erro.value = true
    jogos.value = []
    avaliacoes.value = []
  } finally {
    carregando.value = false
  }
}

onMounted(carregarDestaques)
</script>

<style scoped>
.pagina-inicial {
  min-height: 100vh;
  color: #fff;
  background: #101923;
}

.conteudo {
  max-width: 1250px;
  margin: auto;
  padding: 35px 25px;
}

.destaque {
  min-height: 220px;
  display: flex;
  align-items: center;
  margin-bottom: 35px;
  padding: 35px;
  border-radius: 8px;
  background: linear-gradient(110deg, #1b3a54, #172638 65%, #101923);
}

.subtitulo {
  color: #66c0f4;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 2px;
}

.destaque h1 {
  margin: 8px 0;
  font-size: 34px;
  font-weight: bold;
}

.descricao {
  margin-bottom: 20px;
  color: #bdcbd8;
}

.titulo-secao {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.titulo-secao h2 {
  margin: 0;
  font-size: 23px;
  font-weight: bold;
}

.titulo-secao span {
  color: #8b9cac;
  font-size: 13px;
}

.grade-jogos {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
}

.card-jogo {
  position: relative;
  display: flex;
  min-height: 270px;
  align-items: flex-end;
  overflow: hidden;
  color: #fff;
  background-color: #1b2838;
  background-position: center;
  background-size: cover;
  transition: box-shadow 0.2s;
}

.card-jogo::before {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(16, 25, 35, 0.98), rgba(16, 25, 35, 0.05));
  content: '';
  pointer-events: none;
}

.card-jogo:hover {
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.informacoes {
  position: relative;
  z-index: 1;
  width: 100%;
  margin-top: auto;
  padding: 14px;
}

.nota-jogo {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: bold;
}

.nome-jogo {
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: bold;
}

.descricao-jogo {
  min-height: 35px;
  color: #a8b5c2;
  font-size: 12px;
}

.mensagem {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px;
  color: #aab8c5;
}

@media (max-width: 900px) {
  .grade-jogos {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .grade-jogos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .destaque h1 {
    font-size: 25px;
  }
}
</style>
