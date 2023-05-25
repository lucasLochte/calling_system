import { FiX } from 'react-icons/fi';
import './modal.css';

export default function Modal({ content, close}){
    return(
        <div className="modal">
            <div className="container">
                <button className="close" onClick={close}>
                    <FiX size={25} color="#FFF" />
                    Voltar
                </button>

                <main>
                    <h2>Detalhes do chamado</h2>

                    <div className="row">
                        <span>
                            Cliente: <i>{content.client}</i>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            Assunto: <i>{content.subject}</i>
                        </span>
                        <span>
                            Cadastrado em: <i>{content.createdFormat}</i>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            Status:
                            <i className="style-badge" style={{color: "#FFF" , backgroundColor: content.status === 'Aberto' ? '#5cb85c' : '#999' }}>
                                {content.status}
                            </i>
                        </span>
                    </div>

                    {content.complement !== '' && (
                    <>
                        <h3>Complemento</h3>
                        <p>{content.complement}</p>
                    </>
                    )}
                    
                </main>
            </div>
        </div>
    )
}