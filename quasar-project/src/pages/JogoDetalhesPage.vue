<template>
  <q-page class="pagina-detalhes">
    <div v-if="carregando" class="mensagem">
      <q-spinner color="primary" size="45px" />
      <p>Carregando jogo...</p>
    </div>

    <div v-else-if="erro" class="mensagem">
      <q-icon name="error_outline" size="40px" />
      <p>Não foi possível carregar os dados do jogo.</p>
      <q-btn label="Voltar" color="primary" to="/jogos" />
    </div>

    <main v-else-if="jogo" class="detalhes-container">
      <q-btn
        flat
        icon="arrow_back"
        label="Todos os jogos"
        class="botao-voltar"
        to="/jogos"
      />

      <div class="acoes-jogo">
        <q-btn color="primary" icon="edit" label="Editar" @click="abrirEdicao" />
        <q-btn color="negative" icon="delete" label="Excluir" @click="confirmarExclusao = true" />
      </div>

      <q-banner v-if="mensagemAcao" class="mensagem-acao" rounded>
        {{ mensagemAcao }}
      </q-banner>

      <section class="cabecalho-jogo">
        <div class="capa" :style="estiloCapa"></div>

        <div class="dados-jogo">
          <p class="subtitulo">Detalhes do jogo</p>
          <h1>{{ jogo.nome }}</h1>

          <div class="informacoes">
            <p><strong>Desenvolvedora:</strong> {{ jogo.desenvolvedora || 'Não informada' }}</p>
            <p><strong>Ano de lançamento:</strong> {{ jogo.ano_lancamento || 'Não informado' }}</p>
            <p><strong>Plataforma:</strong> {{ jogo.plataforma || 'Não informada' }}</p>
          </div>

          <p class="resumo">{{ jogo.resumo || 'Este jogo ainda não possui descrição.' }}</p>
        </div>
      </section>

      <section class="avaliacoes">
        <div class="titulo-avaliacoes">
          <h2>Avaliações</h2>
          <div class="resumo-avaliacoes">
            <span v-if="avaliacoes.length">{{ avaliacoes.length }} avaliação(ões)</span>
            <strong>
              <q-icon name="star" color="amber" size="18px" />
              Média: {{ mediaNotas ?? '—' }}<small v-if="mediaNotas !== null"> / 10</small>
            </strong>
          </div>
        </div>
        <p class="nota-votos">Votos e ordenação salvos somente neste navegador.</p>

        <q-btn
          color="primary"
          icon="add"
          :label="mostrarFormulario ? 'Cancelar avaliação' : 'Adicionar avaliação'"
          @click="mostrarFormulario = !mostrarFormulario"
        />

        <q-form v-if="mostrarFormulario" class="form-avaliacao" @submit.prevent="publicarAvaliacao">
          <q-input
            v-model.number="novaAvaliacao.nota"
            type="number"
            label="Sua nota (1 a 10)"
            min="1"
            max="10"
            outlined
            color="primary"
            label-color="grey-8"
            input-class="text-dark"
            required
          />
          <q-input
            v-model.trim="novaAvaliacao.comentario"
            type="textarea"
            label="Escreva sua avaliação"
            maxlength="1000"
            outlined
            color="primary"
            label-color="grey-8"
            input-class="text-dark"
            required
          />
          <q-toggle
            v-model="novaAvaliacao.gostei"
            label="Gostei deste jogo"
            class="text-dark"
            color="primary"
          />
          <q-banner v-if="erroAvaliacao" class="erro-avaliacao" rounded>
            {{ erroAvaliacao }}
          </q-banner>
          <q-btn
            type="submit"
            color="primary"
            label="Publicar avaliação"
            :loading="enviandoAvaliacao"
          />
        </q-form>

        <div v-if="avaliacoes.length === 0" class="sem-avaliacoes">
          Nenhuma avaliação cadastrada para este jogo.
        </div>

        <article
          v-for="avaliacao in avaliacoesOrdenadas"
          :key="avaliacao.id"
          class="card-avaliacao"
        >
          <div class="nota">Nota: {{ avaliacao.nota }}/10</div>
          <p>{{ avaliacao.comentario }}</p>
          <div class="meta-avaliacao">
            <span>
              {{ formatarDataAvaliacao(avaliacao) }}
              <span v-if="avaliacao.editado">(editado)</span>
            </span>
            <span>{{ avaliacao.gostei ? 'Gostou' : 'Não gostou' }}</span>
          </div>
          <div class="acoes-voto">
            <q-btn
              flat
              dense
              icon="thumb_up"
              :label="String(avaliacao.likesLocais)"
              :color="avaliacao.meuVoto === 'like' ? 'positive' : 'grey-6'"
              aria-label="Curtir avaliação"
              @click="alternarVoto(avaliacao, 'like')"
            />
            <q-btn
              flat
              dense
              icon="thumb_down"
              :label="String(avaliacao.dislikesLocais)"
              :color="avaliacao.meuVoto === 'dislike' ? 'negative' : 'grey-6'"
              aria-label="Não curtir avaliação"
              @click="alternarVoto(avaliacao, 'dislike')"
            />
          </div>
          <div class="acoes-avaliacao">
            <q-btn
              flat
              dense
              color="primary"
              icon="edit"
              label="Editar"
              @click="abrirEdicaoAvaliacao(avaliacao)"
            />
            <q-btn
              flat
              dense
              color="negative"
              icon="delete"
              label="Excluir"
              @click="abrirExclusaoAvaliacao(avaliacao)"
            />
          </div>
        </article>
      </section>
    </main>

    <q-dialog v-model="editando">
      <q-card class="dialogo-edicao">
        <q-card-section>
          <div class="text-h6">Editar jogo</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <label class="capa-editor" :style="estiloCapaEdicao">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              @change="selecionarCapa"
            />
            <span>Escolher outra imagem</span>
          </label>
          <div v-if="erroCapa" class="erro-capa">{{ erroCapa }}</div>
          <q-input v-model="formEdicao.nome" label="Nome do jogo" outlined color="primary" label-color="grey-8" input-class="text-dark" />
          <q-input v-model="formEdicao.desenvolvedora" label="Desenvolvedora" outlined color="primary" label-color="grey-8" input-class="text-dark" />
          <q-input v-model.number="formEdicao.ano_lancamento" label="Ano de lançamento" type="number" outlined color="primary" label-color="grey-8" input-class="text-dark" />
          <q-select
            v-model="formEdicao.plataforma"
            label="Plataforma"
            :options="['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Multiplataforma', 'Outra']"
            outlined
            color="primary"
            label-color="grey-8"
            input-class="text-dark"
            popup-content-class="bg-white text-dark"
          />
          <q-input
            v-model="formEdicao.resumo"
            label="Descrição"
            type="textarea"
            outlined
            color="primary"
            label-color="grey-8"
            input-class="text-dark"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            color="primary"
            label="Salvar"
            :loading="salvando"
            :disable="!formEdicao.nome"
            @click="salvarEdicao"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmarExclusao">
      <q-card class="dialogo-exclusao">
        <q-card-section>
          <div class="text-h6 titulo-exclusao">Excluir jogo</div>
          <p class="texto-exclusao">Tem certeza que deseja excluir "{{ jogo?.nome }}"?</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            color="negative"
            label="Excluir"
            :loading="excluindo"
            @click="excluirJogo"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editarAvaliacaoAberto">
      <q-card class="dialogo-edicao-avaliacao">
        <q-card-section>
          <div class="text-h6">Editar avaliação</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            v-model.number="formEdicaoAvaliacao.nota"
            type="number"
            label="Nota (1 a 10)"
            min="1"
            max="10"
            outlined
            color="primary"
            label-color="grey-8"
            input-class="text-dark"
          />
          <q-input
            v-model.trim="formEdicaoAvaliacao.comentario"
            type="textarea"
            label="Comentário"
            maxlength="1000"
            outlined
            color="primary"
            label-color="grey-8"
            input-class="text-dark"
          />
          <q-input
            v-model.number="formEdicaoAvaliacao.ano_avaliacao"
            type="number"
            label="Ano da avaliação"
            outlined
            color="primary"
            label-color="grey-8"
            input-class="text-dark"
          />
          <q-toggle
            v-model="formEdicaoAvaliacao.gostei"
            label="Gostei deste jogo"
            class="text-dark"
            color="primary"
          />
          <q-banner v-if="erroEdicaoAvaliacao" class="erro-avaliacao" rounded>
            {{ erroEdicaoAvaliacao }}
          </q-banner>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            color="primary"
            label="Salvar alterações"
            :loading="salvandoAvaliacao"
            @click="salvarEdicaoAvaliacao"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmarExclusaoAvaliacao">
      <q-card class="dialogo-exclusao">
        <q-card-section>
          <div class="text-h6 titulo-exclusao">Excluir avaliação</div>
          <p class="texto-exclusao">
            Tem certeza que deseja excluir esta avaliação?
          </p>
          <q-banner v-if="erroExclusaoAvaliacao" class="erro-avaliacao" rounded>
            {{ erroExclusaoAvaliacao }}
          </q-banner>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            color="negative"
            label="Excluir"
            :loading="excluindoAvaliacao"
            @click="excluirAvaliacao"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  atualizarJogo,
  atualizarAvaliacao,
  cadastrarAvaliacao,
  deletarAvaliacao,
  deletarJogo,
  getAvaliacoes,
  getJogo
} from '@/services/jogo.js'

const route = useRoute()
const router = useRouter()
const jogo = ref(null)
const avaliacoes = ref([])
const carregando = ref(false)
const erro = ref(false)
const editando = ref(false)
const confirmarExclusao = ref(false)
const salvando = ref(false)
const excluindo = ref(false)
const mensagemAcao = ref('')
const imagemSelecionada = ref(null)
const imagemPreview = ref('')
const erroCapa = ref('')
const votosLocais = ref({})
const mostrarFormulario = ref(false)
const enviandoAvaliacao = ref(false)
const erroAvaliacao = ref('')
const editarAvaliacaoAberto = ref(false)
const confirmarExclusaoAvaliacao = ref(false)
const salvandoAvaliacao = ref(false)
const excluindoAvaliacao = ref(false)
const erroEdicaoAvaliacao = ref('')
const erroExclusaoAvaliacao = ref('')
const avaliacaoSelecionada = ref(null)
const formEdicaoAvaliacao = ref({
  nota: 5,
  comentario: '',
  ano_avaliacao: new Date().getFullYear(),
  gostei: true
})
const novaAvaliacao = ref({
  nota: 5,
  comentario: '',
  gostei: true
})
const formEdicao = ref({
  nome: '',
  resumo: '',
  desenvolvedora: '',
  ano_lancamento: null,
  plataforma: ''
})

const mediaNotas = computed(() => {
  const notas = avaliacoes.value
    .map((avaliacao) => Number(avaliacao.nota))
    .filter(Number.isFinite)

  if (notas.length === 0) return null

  const soma = notas.reduce((total, nota) => total + nota, 0)
  return (soma / notas.length).toFixed(1)
})

const avaliacoesOrdenadas = computed(() =>
  avaliacoes.value
    .map((avaliacao) => {
      const meuVoto = votosLocais.value[String(avaliacao.id)] || null
      return {
        ...avaliacao,
        meuVoto,
        likesLocais: meuVoto === 'like' ? 1 : 0,
        dislikesLocais: meuVoto === 'dislike' ? 1 : 0
      }
    })
    .sort((a, b) => b.likesLocais - a.likesLocais)
)

function formatarDataAvaliacao(avaliacao) {
  if (!avaliacao.data_avaliacao) return avaliacao.ano_avaliacao

  const [ano, mes, dia] = String(avaliacao.data_avaliacao)
    .slice(0, 10)
    .split('-')

  return `${dia}/${mes}/${ano}`
}

const estiloCapa = computed(() => ({
  backgroundImage: jogo.value?.imagem
    ? `url("${jogo.value.imagem}")`
    : 'linear-gradient(145deg, #20352f, #17242b)'
}))

const estiloCapaEdicao = computed(() => ({
  backgroundImage: imagemPreview.value
    ? `url("${imagemPreview.value}")`
    : 'linear-gradient(145deg, #20352f, #17242b)'
}))

function limparPreviewCapa() {
  if (imagemPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagemPreview.value)
  }
  imagemPreview.value = ''
}

async function carregarDetalhes() {
  carregando.value = true
  erro.value = false
  jogo.value = null
  avaliacoes.value = []

  try {
    const jogos = await getJogo()
    jogo.value = jogos.find((item) => String(item.id) === String(route.params.id)) ?? null

    if (!jogo.value) {
      erro.value = true
      return
    }

    const listaAvaliacoes = await getAvaliacoes()
    avaliacoes.value = listaAvaliacoes.filter(
      (avaliacao) => String(avaliacao.jogo_id) === String(jogo.value.id)
    )
  } catch (error) {
    console.error('Erro ao carregar detalhes do jogo:', error)
    erro.value = true
  } finally {
    carregando.value = false
  }
}

function carregarVotosLocais() {
  try {
    const votosSalvos = localStorage.getItem('votos-avaliacoes')
    votosLocais.value = votosSalvos ? JSON.parse(votosSalvos) : {}
  } catch (error) {
    console.error('Não foi possível carregar os votos salvos neste navegador:', error)
    votosLocais.value = {}
  }
}

function alternarVoto(avaliacao, tipo) {
  const id = String(avaliacao.id)
  const votosAtualizados = { ...votosLocais.value }

  if (votosAtualizados[id] === tipo) {
    delete votosAtualizados[id]
  } else {
    votosAtualizados[id] = tipo
  }

  try {
    localStorage.setItem('votos-avaliacoes', JSON.stringify(votosAtualizados))
    votosLocais.value = votosAtualizados
    mensagemAcao.value = ''
  } catch (error) {
    console.error('Não foi possível salvar o voto neste navegador:', error)
    mensagemAcao.value = 'Não foi possível salvar seu voto neste navegador.'
  }
}

async function publicarAvaliacao() {
  const nota = Number(novaAvaliacao.value.nota)
  const comentario = novaAvaliacao.value.comentario.trim()
  erroAvaliacao.value = ''

  if (!Number.isInteger(nota) || nota < 1 || nota > 10) {
    erroAvaliacao.value = 'Informe uma nota inteira entre 1 e 10.'
    return
  }

  if (!comentario) {
    erroAvaliacao.value = 'Escreva um comentário para publicar sua avaliação.'
    return
  }

  enviandoAvaliacao.value = true
  try {
    await cadastrarAvaliacao({
      nota,
      comentario,
      ano_avaliacao: new Date().getFullYear(),
      gostei: novaAvaliacao.value.gostei,
      jogo_id: jogo.value.id
    })

    novaAvaliacao.value = { nota: 5, comentario: '', gostei: true }
    mostrarFormulario.value = false
    mensagemAcao.value = 'Avaliação publicada com sucesso.'
    await carregarDetalhes()
  } catch (error) {
    console.error('Erro ao publicar avaliação:', error)
    const mensagem = error.response?.data?.message || 'Não foi possível publicar sua avaliação.'
    const detalhe = error.response?.data?.error
    erroAvaliacao.value = detalhe ? `${mensagem}: ${detalhe}` : mensagem
  } finally {
    enviandoAvaliacao.value = false
  }
}

function abrirEdicaoAvaliacao(avaliacao) {
  avaliacaoSelecionada.value = avaliacao
  erroEdicaoAvaliacao.value = ''
  formEdicaoAvaliacao.value = {
    nota: Number(avaliacao.nota),
    comentario: avaliacao.comentario || '',
    ano_avaliacao: Number(avaliacao.ano_avaliacao),
    gostei: Number(avaliacao.gostei) === 1
  }
  editarAvaliacaoAberto.value = true
}

async function salvarEdicaoAvaliacao() {
  const nota = Number(formEdicaoAvaliacao.value.nota)
  const comentario = formEdicaoAvaliacao.value.comentario.trim()
  const anoAvaliacao = Number(formEdicaoAvaliacao.value.ano_avaliacao)
  erroEdicaoAvaliacao.value = ''

  if (!Number.isInteger(nota) || nota < 1 || nota > 10) {
    erroEdicaoAvaliacao.value = 'Informe uma nota inteira entre 1 e 10.'
    return
  }

  if (!comentario || !Number.isInteger(anoAvaliacao) || anoAvaliacao < 1) {
    erroEdicaoAvaliacao.value = 'Informe o comentário e um ano válido.'
    return
  }

  salvandoAvaliacao.value = true
  try {
    await atualizarAvaliacao(avaliacaoSelecionada.value.id, {
      nota,
      comentario,
      ano_avaliacao: anoAvaliacao,
      gostei: formEdicaoAvaliacao.value.gostei
    })
    editarAvaliacaoAberto.value = false
    mensagemAcao.value = 'Avaliação atualizada com sucesso.'
    await carregarDetalhes()
  } catch (error) {
    console.error('Erro ao editar avaliação:', error)
    const mensagem = error.response?.data?.message || 'Não foi possível editar a avaliação.'
    const detalhe = error.response?.data?.error
    erroEdicaoAvaliacao.value = detalhe ? `${mensagem}: ${detalhe}` : mensagem
  } finally {
    salvandoAvaliacao.value = false
  }
}

function abrirExclusaoAvaliacao(avaliacao) {
  avaliacaoSelecionada.value = avaliacao
  erroExclusaoAvaliacao.value = ''
  confirmarExclusaoAvaliacao.value = true
}

async function excluirAvaliacao() {
  excluindoAvaliacao.value = true
  erroExclusaoAvaliacao.value = ''
  try {
    const id = String(avaliacaoSelecionada.value.id)
    await deletarAvaliacao(id)

    const votosAtualizados = { ...votosLocais.value }
    delete votosAtualizados[id]
    try {
      localStorage.setItem('votos-avaliacoes', JSON.stringify(votosAtualizados))
      votosLocais.value = votosAtualizados
    } catch (error) {
      console.error('Não foi possível atualizar os votos locais:', error)
    }

    confirmarExclusaoAvaliacao.value = false
    mensagemAcao.value = 'Avaliação excluída com sucesso.'
    await carregarDetalhes()
  } catch (error) {
    console.error('Erro ao excluir avaliação:', error)
    const mensagem = error.response?.data?.message || 'Não foi possível excluir a avaliação.'
    const detalhe = error.response?.data?.error
    erroExclusaoAvaliacao.value = detalhe ? `${mensagem}: ${detalhe}` : mensagem
  } finally {
    excluindoAvaliacao.value = false
  }
}

function abrirEdicao() {
  mensagemAcao.value = ''
  erroCapa.value = ''
  imagemSelecionada.value = null
  limparPreviewCapa()
  imagemPreview.value = jogo.value.imagem || ''
  formEdicao.value = {
    nome: jogo.value.nome,
    resumo: jogo.value.resumo || '',
    desenvolvedora: jogo.value.desenvolvedora || '',
    ano_lancamento: jogo.value.ano_lancamento,
    plataforma: jogo.value.plataforma || ''
  }
  editando.value = true
}

function selecionarCapa(event) {
  const arquivo = event.target.files?.[0]
  erroCapa.value = ''

  if (!arquivo) return

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(arquivo.type)) {
    erroCapa.value = 'Escolha uma imagem JPG, PNG ou WEBP.'
    event.target.value = ''
    return
  }

  if (arquivo.size > 5 * 1024 * 1024) {
    erroCapa.value = 'A imagem deve ter no máximo 5 MB.'
    event.target.value = ''
    return
  }

  limparPreviewCapa()
  imagemSelecionada.value = arquivo
  imagemPreview.value = URL.createObjectURL(arquivo)
}

async function salvarEdicao() {
  salvando.value = true
  mensagemAcao.value = ''
  try {
    const dados = new FormData()
    Object.entries(formEdicao.value).forEach(([campo, valor]) => {
      dados.append(campo, valor == null ? '' : String(valor))
    })
    if (imagemSelecionada.value) {
      dados.append('imagem', imagemSelecionada.value)
    }

    await atualizarJogo(jogo.value.id, dados)
    editando.value = false
    imagemSelecionada.value = null
    limparPreviewCapa()
    await carregarDetalhes()
    mensagemAcao.value = 'Jogo atualizado com sucesso.'
  } catch (error) {
    console.error('Erro ao editar jogo:', error)
    mensagemAcao.value =
      error.response?.data?.message || 'Não foi possível salvar as alterações.'
  } finally {
    salvando.value = false
  }
}

async function excluirJogo() {
  excluindo.value = true
  mensagemAcao.value = ''
  try {
    await deletarJogo(jogo.value.id)
    confirmarExclusao.value = false
    await router.push('/jogos')
  } catch (error) {
    console.error('Erro ao excluir jogo:', error)
    confirmarExclusao.value = false
    mensagemAcao.value =
      error.response?.data?.message || 'Não foi possível excluir o jogo.'
  } finally {
    excluindo.value = false
  }
}

onMounted(carregarDetalhes)
onMounted(carregarVotosLocais)
watch(() => route.params.id, carregarDetalhes)
onBeforeUnmount(limparPreviewCapa)
</script>

<style scoped>
.pagina-detalhes {
  min-height: 100vh;
  padding: 35px 25px;
  color: #fff;
  background: #101923;
}

.detalhes-container {
  max-width: 1100px;
  margin: 0 auto;
}

.acoes-jogo {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
}

.dialogo-edicao {
  width: min(600px, 90vw);
  color: #202b38;
  background: #fff;
}

.dialogo-edicao-avaliacao {
  width: min(560px, 90vw);
  color: #202b38;
  background: #fff;
}

.dialogo-exclusao {
  min-width: min(360px, 90vw);
  color: #202b38;
  background: #fff;
}

.titulo-exclusao,
.texto-exclusao {
  color: #202b38;
}

.texto-exclusao {
  margin-bottom: 0;
}

.capa-editor {
  position: relative;
  display: flex;
  min-height: 220px;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  border-radius: 10px;
  background-position: center;
  background-size: cover;
  cursor: pointer;
}

.capa-editor input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.capa-editor span {
  width: 100%;
  padding: 12px;
  color: #fff;
  background: #101923d9;
  text-align: center;
}

.erro-capa {
  color: #c10015;
  font-size: 12px;
}

.mensagem-acao {
  margin-bottom: 16px;
  color: #fff;
  background: #293746;
}

.botao-voltar {
  margin-bottom: 20px;
  color: #66c0f4;
}

.cabecalho-jogo {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 35px;
  margin-bottom: 35px;
  padding: 30px;
  border: 1px solid #293746;
  border-radius: 12px;
  background: #171f2b;
}

.capa {
  min-height: 400px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
}

.subtitulo {
  color: #66c0f4;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 2px;
}

.dados-jogo h1 {
  margin: 8px 0 20px;
  font-size: 38px;
}

.informacoes {
  display: grid;
  gap: 8px;
  color: #bdcbd8;
}

.informacoes p {
  margin: 0;
}

.resumo {
  margin-top: 24px;
  color: #d1dbe4;
  line-height: 1.7;
}

.avaliacoes {
  display: grid;
  gap: 14px;
}

.nota-votos {
  margin: -8px 0 0;
  color: #8b9cac;
  font-size: 12px;
}

.form-avaliacao {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid #d8e0e8;
  border-radius: 10px;
  color: #202b38;
  background: #fff;
}

.erro-avaliacao {
  color: #fff;
  background: #7a3038;
}

.titulo-avaliacoes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #bdcbd8;
}

.titulo-avaliacoes h2 {
  color: #fff;
  margin: 0;
}

.resumo-avaliacoes {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 4px;
  color: #bdcbd8;
  font-size: 13px;
}

.resumo-avaliacoes strong {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #66c0f4;
  font-size: 16px;
}

.resumo-avaliacoes small {
  font-size: 12px;
}

.sem-avaliacoes,
.card-avaliacao {
  border: 1px solid #293746;
  border-radius: 10px;
  color: #fff;
  background: #171f2b;
}

.sem-avaliacoes {
  padding: 30px;
  color: #aab8c5;
  text-align: center;
}

.card-avaliacao {
  padding: 18px;
}

.card-avaliacao p {
  color: #fff;
}

.nota {
  color: #66c0f4;
  font-weight: bold;
}

.meta-avaliacao {
  display: flex;
  justify-content: space-between;
  color: #8b9cac;
  font-size: 12px;
}

.acoes-voto {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.acoes-avaliacao {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.mensagem {
  display: flex;
  min-height: 300px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #aab8c5;
}

@media (max-width: 700px) {
  .cabecalho-jogo {
    grid-template-columns: 1fr;
  }

  .capa {
    min-height: 300px;
  }
}
</style>
