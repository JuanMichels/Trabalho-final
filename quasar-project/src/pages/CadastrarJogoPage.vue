
<template>
  <q-page class="cadastro-page">
    <div class="cadastro-container">

      <header class="page-header">
        <div>
          <span class="eyebrow">ALL GAME COME / BIBLIOTECA</span>
          <h1>Adicionar um jogo</h1>
          <p>Cadastre um novo título na sua biblioteca.</p>
        </div>
        <div class="header-icon">＋</div>
      </header>

      <form class="game-form" @submit.prevent="salvarJogo">

        <!-- CAPA DO JOGO -->
        <section class="cover-section">
          <div class="section-heading">
            <span class="step">01</span>
            <div>
              <h2>Capa do jogo</h2>
              <p>Escolha uma imagem para representar o jogo.</p>
            </div>
          </div>

          <label class="cover-upload" :class="{ 'has-image': imagemPreview }">
            <img
              v-if="imagemPreview"
              :src="imagemPreview"
              alt="Pré-visualização da capa"
            />

            <div v-else class="upload-placeholder">
              <span class="upload-symbol">⇧</span>
              <strong>Adicionar imagem</strong>
              <span>PNG, JPG ou WEBP</span>
              <small>Clique para selecionar uma imagem</small>
            </div>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              class="file-input"
              @change="selecionarImagem"
            />

            <span v-if="imagemPreview" class="change-cover">
              Trocar imagem
            </span>
          </label>

          <p v-if="erroImagem" class="field-error">
            {{ erroImagem }}
          </p>

          <p class="cover-tip">
            Escolha uma imagem de boa qualidade para a capa do jogo.
          </p>
        </section>

        <!-- INFORMAÇÕES -->
        <section class="details-section">
          <div class="section-heading">
            <span class="step">02</span>
            <div>
              <h2>Informações do jogo</h2>
              <p>Preencha os dados do título.</p>
            </div>
          </div>

          <div class="fields-grid">

            <label class="field full">
              <span>Nome do jogo <b>*</b></span>
              <input
                v-model.trim="form.nome"
                type="text"
                placeholder="Ex.: The Witcher 3: Wild Hunt"
                required
              />
            </label>

            <label class="field">
              <span>Desenvolvedora</span>
              <input
                v-model.trim="form.desenvolvedora"
                type="text"
                placeholder="Ex.: CD Projekt Red"
              />
            </label>

            <label class="field">
              <span>Ano de lançamento</span>
              <input
                v-model.number="form.ano_lancamento"
                type="number"
                min="1950"
                :max="anoAtual + 2"
                placeholder="Ex.: 2015"
              />
            </label>

            <label class="field full">
              <span>Plataforma</span>
              <select v-model="form.plataforma">
                <option value="" disabled>
                  Selecione uma plataforma
                </option>
                <option>PC</option>
                <option>PlayStation</option>
                <option>Xbox</option>
                <option>Nintendo Switch</option>
                <option>Multiplataforma</option>
                <option>Outra</option>
              </select>
            </label>

            <label class="field full">
              <span>Descrição</span>
              <textarea
                v-model.trim="form.resumo"
                rows="5"
                maxlength="600"
                placeholder="Conte um pouco sobre o jogo..."
              ></textarea>
              <small>{{ form.resumo.length }}/600 caracteres</small>
            </label>

          </div>
        </section>

        <div
          v-if="mensagem"
          class="feedback"
          :class="tipoMensagem"
        >
          {{ mensagem }}
        </div>

        <!-- BOTÕES -->
        <footer class="form-actions">
          <button
            type="button"
            class="btn-secondary"
            @click="limparFormulario"
            :disabled="salvando"
          >
            Limpar
          </button>

          <button
            type="submit"
            class="btn-primary"
            :disabled="salvando || !form.nome"
          >
            <span v-if="salvando" class="spinner"></span>
            {{ salvando ? 'Salvando...' : '＋ Cadastrar jogo' }}
          </button>
        </footer>

      </form>
    </div>
  </q-page>
</template>



<script setup>
import { reactive, ref, onBeforeUnmount } from 'vue'
import { api } from '@/boot/axios'

const anoAtual = new Date().getFullYear()

const formInicial = () => ({
  nome: '',
  resumo: '',
  desenvolvedora: '',
  ano_lancamento: null,
  plataforma: ''
})

const form = reactive(formInicial())

const imagem = ref(null)
const imagemPreview = ref('')
const erroImagem = ref('')
const salvando = ref(false)
const mensagem = ref('')
const tipoMensagem = ref('')

function selecionarImagem(event) {
  const arquivo = event.target.files?.[0]
  erroImagem.value = ''

  if (!arquivo) return

  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']

  if (!tiposPermitidos.includes(arquivo.type)) {
    erroImagem.value = 'Escolha uma imagem JPG, PNG ou WEBP.'
    event.target.value = ''
    return
  }

  if (arquivo.size > 5 * 1024 * 1024) {
    erroImagem.value = 'A imagem deve ter no máximo 5 MB.'
    event.target.value = ''
    return
  }

  if (imagemPreview.value) {
    URL.revokeObjectURL(imagemPreview.value)
  }

  imagem.value = arquivo
  imagemPreview.value = URL.createObjectURL(arquivo)
}

function limparFormulario() {
  Object.assign(form, formInicial())
  imagem.value = null

  if (imagemPreview.value) {
    URL.revokeObjectURL(imagemPreview.value)
  }

  imagemPreview.value = ''
  erroImagem.value = ''

  const input = document.querySelector('.file-input')
  if (input) input.value = ''
}

async function salvarJogo() {
  mensagem.value = ''
  tipoMensagem.value = ''

  if (!form.nome.trim()) {
    mensagem.value = 'Informe o nome do jogo.'
    tipoMensagem.value = 'erro'
    return
  }

  const dados = new FormData()
  dados.append('nome', form.nome)
  dados.append('resumo', form.resumo)
  dados.append('desenvolvedora', form.desenvolvedora)
  if (form.ano_lancamento !== null && form.ano_lancamento !== '') {
    dados.append('ano_lancamento', String(form.ano_lancamento))
  }
  dados.append('plataforma', form.plataforma)

  if (imagem.value) {
    dados.append('imagem', imagem.value)
  }

  salvando.value = true

  try {
    await api.post('/jogo', dados)

    limparFormulario()
    mensagem.value = 'Jogo cadastrado com sucesso!'
    tipoMensagem.value = 'sucesso'

  } catch (error) {
    console.error('Erro ao cadastrar jogo:', error)

    mensagem.value =
      error.response?.data?.message ||
      'Não foi possível cadastrar o jogo. Verifique os dados informados e a API.'

    tipoMensagem.value = 'erro'

  } finally {
    salvando.value = false
  }
}

onBeforeUnmount(() => {
  if (imagemPreview.value) {
    URL.revokeObjectURL(imagemPreview.value)
  }
})
</script>



<style scoped>
.cadastro-page {
  min-height: 100vh;
  padding: 42px 22px 64px;
  color: #e8edf2;
  background:
    radial-gradient(ellipse at 12% 0%, #17352d 0, transparent 38%),
    #101820;
}

.cadastro-container {
  width: min(1080px, 100%);
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 30px;
}

.eyebrow {
  color: #80c7a7;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
}

.page-header h1 {
  margin: 9px 0 7px;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  letter-spacing: -1.2px;
}

.page-header p {
  margin: 0;
  color: #9baab4;
  font-size: 14px;
}

.header-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border: 1px solid #355447;
  border-radius: 15px;
  color: #9ad9b9;
  background: #1b302a;
  font-size: 30px;
}

.game-form {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 28px;
  padding: 28px;
  border: 1px solid #2b3b43;
  border-radius: 18px;
  background: rgba(22, 34, 42, .96);
  box-shadow: 0 22px 60px #0004;
}

.cover-section,
.details-section {
  min-width: 0;
}

.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 22px;
}

.step {
  display: grid;
  flex: 0 0 30px;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  color: #a5e3c3;
  background: #244538;
  font-size: 12px;
  font-weight: 800;
}

.section-heading h2 {
  margin: 2px 0 5px;
  font-size: 17px;
  font-weight: 750;
}

.section-heading p {
  margin: 0;
  color: #9baab4;
  font-size: 12px;
  line-height: 1.5;
}

/* ÁREA DA IMAGEM */

.cover-upload {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border: 1px dashed #527565;
  border-radius: 14px;
  background: linear-gradient(145deg, #20352f, #17242b);
  cursor: pointer;
}

.cover-upload:hover {
  border-color: #8bd6b1;
  background-color: #243d34;
}

.cover-upload img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  padding: 20px;
  text-align: center;
}

.upload-symbol {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  margin-bottom: 5px;
  border-radius: 50%;
  color: #a5e3c3;
  background: #2b4a3d;
  font-size: 30px;
}

.upload-placeholder strong {
  font-size: 15px;
}

.upload-placeholder span:not(.upload-symbol) {
  color: #aab8b5;
  font-size: 12px;
}

.upload-placeholder small,
.cover-tip {
  color: #7f9298;
  font-size: 11px;
}

.file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.change-cover {
  position: absolute;
  right: 10px;
  bottom: 10px;
  left: 10px;
  padding: 10px;
  border-radius: 8px;
  color: white;
  background: #101820df;
  font-size: 12px;
  text-align: center;
}

.cover-tip {
  margin-top: 12px;
  line-height: 1.5;
}

.field-error {
  color: #ff9999;
  font-size: 12px;
}

/* CAMPOS */

.fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  color: #c9d4d9;
  font-size: 12px;
  font-weight: 700;
}

.field.full {
  grid-column: 1 / -1;
}

.field b {
  color: #7fd3a8;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  border: 1px solid #354850;
  border-radius: 9px;
  outline: none;
  padding: 13px 14px;
  color: #edf3f4;
  background: #111d24;
  font: inherit;
  font-size: 13px;
  font-weight: 400;
  transition: border-color .2s, box-shadow .2s;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: #75c99e;
  box-shadow: 0 0 0 3px #75c99e1c;
}

.field input::placeholder,
.field textarea::placeholder {
  color: #6f8189;
}

.field select {
  color-scheme: dark;
}

.field textarea {
  resize: vertical;
  min-height: 115px;
  line-height: 1.5;
}

.field small {
  align-self: flex-end;
  color: #7f9298;
  font-size: 10px;
  font-weight: 400;
}

/* MENSAGEM */

.feedback {
  grid-column: 1 / -1;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 13px;
}

.feedback.sucesso {
  color: #a9e9c5;
  background: #1c4935;
}

.feedback.erro {
  color: #ffb5b5;
  background: #512d32;
}

/* BOTÕES */

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #2b3b43;
}

.form-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 44px;
  padding: 0 20px;
  border: 0;
  border-radius: 9px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 750;
  transition: transform .2s, background .2s;
}

.form-actions button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.form-actions button:disabled {
  cursor: not-allowed;
  opacity: .55;
}

.btn-secondary {
  color: #c5d0d5;
  background: #2a3941;
}

.btn-primary {
  color: #102219;
  background: linear-gradient(135deg, #a1e5bd, #62bd8e);
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #244c38;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* RESPONSIVIDADE */

@media (max-width: 760px) {
  .cadastro-page {
    padding: 28px 14px 40px;
  }

  .game-form {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .cover-section {
    max-width: 360px;
    width: 100%;
    margin: 0 auto;
  }

  .cover-upload {
    aspect-ratio: 4 / 3;
  }
}

@media (max-width: 480px) {
  .fields-grid {
    grid-template-columns: 1fr;
  }

  .field.full {
    grid-column: auto;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
