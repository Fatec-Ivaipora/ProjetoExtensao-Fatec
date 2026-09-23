import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <h3>Fatec Ivaiporã</h3>
          <p>
            Pesquisa, Extensão e Iniciação Científica em Medicina.
            <br />
            Ivaiporã — Paraná
          </p>
        </div>

        <div className="footer-col">
          <h4>Institucional</h4>
          <ul>
            <li><Link to="/noticias">Notícias</Link></li>
            <li><Link to="/editais">Editais</Link></li>
            <li><Link to="/medicina-baseada-evidencia">Medicina Baseada em Evidência</Link></li>
            <li><Link to="/regimentos">Regimentos</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contato</h4>
          <ul>
            <li>pesquisaextensao@fatecivaipora.com.br</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Fatec Ivaiporã — Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
