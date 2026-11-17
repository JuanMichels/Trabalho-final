
<template>
  <q-page class="pagina-jogos">

    <!-- CABEÇALHO -->
    <header class="topo">
      <div class="logo">
        ALL GAME <span>COME</span>
      </div>

    </header>

    <!-- CONTEÚDO -->
    <main class="conteudo">

      <section class="destaque">
        <div>
          <p class="subtitulo">Avaliações dos Jogos</p>
          <h1>Veja a review dos jogos</h1>
          <p class="descricao">
            Encontre jogos, conheça novidades e descubra
            novas aventuras com base na experiencias de outros jogadores.
          </p>
        </div>
      </section>

      <!-- CARREGAMENTO -->
      <div v-if="carregando" class="mensagem">
        <q-spinner color="blue" size="45px" />
        <p>Carregando jogos...</p>
      </div>

      <!-- ERRO -->
      <div v-else-if="erro" class="mensagem">
        <q-icon name="error_outline" size="40px" />
        <p>Não foi possível carregar os jogos.</p>
        <q-btn
          label="Tentar novamente"
          color="primary"
          @click="carregarJogos"
        />
      </div>

      <!-- NENHUM JOGO -->
      <div v-else-if="jogos.length === 0" class="mensagem">
        <q-icon name="videogame_asset_off" size="45px" />
        <p>Nenhum jogo cadastrado.</p>
      </div>

      <!-- LISTAGEM -->
      <section v-else>
        <div class="titulo-secao">
          <h2>Todos os jogos</h2>
          <span>Catálogo completo</span>
        </div>

        <div class="grade-jogos">

          <q-card
            v-for="jogo in jogos"
            :key="jogo.id"
            class="card-jogo"
            flat
            :style="estiloFundo(jogo.imagem)"
          >
            <q-card-section class="informacoes">
              <div class="nome-jogo">
                {{ jogo.nome }}
              </div>

              <div class="descricao-jogo">
  {{ jogo.resumo }}
</div>
            </q-card-section>

          </q-card>

        </div>
      </section>

    </main>

  </q-page>
</template>

<style scoped>
.pagina-jogos {
  background: #101923;
  min-height: 100vh;
  color: #ffffff;
}

.topo {
  height: 75px;
  background: #171f2b;
  display: flex;
  align-items: center;
  padding: 0 7%;
  gap: 65px;
  border-bottom: 1px solid #293746;
}

.logo {
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 1px;
}

.logo span {
  color: #43a6ed;
}

.menu {
  display: flex;
  gap: 35px;
  color: #aab8c5;
  font-size: 13px;
  font-weight: bold;
}

.menu span {
  cursor: pointer;
}

.menu-ativo {
  color: #66c0f4;
  border-bottom: 3px solid #66c0f4;
  padding: 28px 0 25px;
}

.conteudo {
  max-width: 1250px;
  margin: auto;
  padding: 35px 25px;
}

.destaque {
  min-height: 220px;
  background: linear-gradient(110deg, #1b3a54, #172638 65%, #101923);
  border-radius: 8px;
  padding: 35px;
  display: flex;
  align-items: center;
  margin-bottom: 35px;
}

.subtitulo {
  color: #66c0f4;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 2px;
}

.destaque h1 {
  font-size: 34px;
  font-weight: bold;
  margin: 8px 0;
}

.descricao {
  color: #bdcbd8;
}

.titulo-secao {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.titulo-secao h2 {
  font-size: 23px;
  font-weight: bold;
  margin: 0;
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
  align-items: flex-end;
  min-height: 270px;
  background: #1b2838;
  background-size: cover;
  background-position: center;
  color: white;
  transition: box-shadow 0.2s;
  overflow: hidden;
}

.card-jogo::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(16, 25, 35, 0.98),
    rgba(16, 25, 35, 0.05)
  );
  pointer-events: none;
}

.card-jogo:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.informacoes {
  position: relative;
  z-index: 1;
  width: 100%;
  margin-top: auto;
  padding: 14px;
}

.nome-jogo {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.descricao-jogo {
  font-size: 12px;
  color: #a8b5c2;
  min-height: 35px;
}

.rodape-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.preco {
  color: #b9e2a0;
  font-weight: bold;
}

.mensagem {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #aab8c5;
  gap: 12px;
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

  .topo {
    padding: 0 15px;
    gap: 20px;
  }

  .menu {
    gap: 12px;
    font-size: 10px;
  }

  .destaque h1 {
    font-size: 25px;
  }
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { getJogo } from '@/services/jogo.js'

const jogos = ref([])
const carregando = ref(false)
const erro = ref(false)

function estiloFundo(imagem) {
  return {
    backgroundImage: imagem ? `url(${JSON.stringify(imagem)})` : 'none'
  }
}

async function carregarJogos() {
  carregando.value = true
  erro.value = false

  try {
    const resposta = await getJogo()

    console.log('Resposta completa da API:', resposta)

    const lista = Array.isArray(resposta)
      ? resposta
      : resposta?.data ?? resposta?.jogos ?? []

    if (!Array.isArray(lista)) {
      throw new Error('A API não retornou uma lista de jogos.')
    }

    jogos.value = lista

    console.log('Jogos carregados:', jogos.value)

  } catch (error) {
    console.error('Erro ao buscar jogos:', error)
    erro.value = true
    jogos.value = []

  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  carregarJogos()
})
</script>
