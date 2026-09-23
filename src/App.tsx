import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Editais from './pages/Editais'
import Noticias from './pages/Noticias'
import RevistaCientifica from './pages/RevistaCientifica'
import ProjetosPesquisa from './pages/ProjetosPesquisa'
import Pic from './pages/Pic'
import Mac from './pages/Mac'
import LigasAcademicas from './pages/LigasAcademicas'
import MedicinaBaseadaEvidencia from './pages/MedicinaBaseadaEvidencia'
import Regimentos from './pages/Regimentos'
import Formularios from './pages/Formularios'
import Graduacao from './pages/Graduacao'
import Residencias from './pages/Residencias'
import Monitoria from './pages/Monitoria'
import Picv from './pages/Picv'
import GruposPesquisa from './pages/GruposPesquisa'
import TccTcr from './pages/TccTcr'
import Cep from './pages/Cep'
import ProjetoIntegrador from './pages/ProjetoIntegrador'
import ProjetosExtensao from './pages/ProjetosExtensao'
import CursosExtensao from './pages/CursosExtensao'
import AtividadesExtensao from './pages/AtividadesExtensao'
import Sucupira from './pages/Sucupira'
import FundacoesAssociacoes from './pages/FundacoesAssociacoes'
import Admin from './pages/admin/Admin'

function App() {
  return (
    <Routes>
      <Route path="admin" element={<Admin />} />

      <Route element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="graduacao" element={<Graduacao />} />
        <Route path="ligas-academicas" element={<LigasAcademicas />} />
        <Route path="residencias" element={<Residencias />} />
        <Route path="monitoria" element={<Monitoria />} />

        <Route path="pic" element={<Pic />} />
        <Route path="picv" element={<Picv />} />
        <Route path="mac" element={<Mac />} />
        <Route path="revista-cientifica" element={<RevistaCientifica />} />
        <Route path="grupos-pesquisa" element={<GruposPesquisa />} />
        <Route path="projetos-pesquisa" element={<ProjetosPesquisa />} />
        <Route path="tcc-tcr" element={<TccTcr />} />
        <Route path="cep" element={<Cep />} />

        <Route path="projeto-integrador-mopi" element={<ProjetoIntegrador />} />
        <Route path="projetos-extensao" element={<ProjetosExtensao />} />
        <Route path="cursos-extensao" element={<CursosExtensao />} />
        <Route path="atividades-extensao" element={<AtividadesExtensao />} />
        <Route path="sucupira" element={<Sucupira />} />
        <Route path="fundacoes-associacoes" element={<FundacoesAssociacoes />} />

        <Route path="editais" element={<Editais />} />
        <Route path="noticias" element={<Noticias />} />
        <Route path="medicina-baseada-evidencia" element={<MedicinaBaseadaEvidencia />} />
        <Route path="regimentos" element={<Regimentos />} />
        <Route path="formularios" element={<Formularios />} />
      </Route>
    </Routes>
  )
}

export default App
