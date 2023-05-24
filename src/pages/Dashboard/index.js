import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../../contexts/auth"
import Header from "../../components/Header";
import Title from "../../components/Title";
import { Link } from "react-router-dom";
import { db } from "../../services/firebaseConnection";
import { collection, getDocs, query, limit, orderBy, startAfter } from 'firebase/firestore';
import { format } from 'date-fns';

import './dashboard.css';

import { FiPlus, FiMessageSquare, FiEdit2, FiSearch } from "react-icons/fi";

export default function Dashboard(){

    const [callingList, setCallingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    const [lastDoc, setLastDoc] = useState();
    const [loadingPagination, setLoadingPagination] = useState(false);

    //const {logout} = useContext(AuthContext);


    useEffect(() => {
        async function loadChamados(){
            const q = query(collection(db, "tickets"), orderBy("data", "desc"), limit(5));

            const querySnapshot = await getDocs(q);
            setCallingList([]);
            await updateState(querySnapshot);

            setLoading(false)
        }

        loadChamados();

        // Quando desmontar o componente, podemos fazer alguma coisa, como LIMPAR A LISTA
        return () => {}
    }, [])

    async function updateState(querySnapshot){
        const isCollectionEmpty = querySnapshot.size === 0;

        if(!isCollectionEmpty){
            let list = [];

            querySnapshot.forEach((doc) =>{
                list.push({
                    id: doc.id,
                    subject: doc.data().assunto,
                    client: doc.data().cliente,
                    clientId: doc.data().clientId,
                    created: doc.data().data,
                    createdFormat: format(doc.data().data.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complement: doc.data().complemento,
                })
            })

            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

            setCallingList(callingList => [... callingList, ...list]);
            setLastDoc(lastDoc);
        }
        else{
            setIsEmpty(true);
        }

        setLoadingPagination(false);
    }

    async function handleMore(){
        setLoadingPagination(true);

        const q = query(collection(db, "tickets"), orderBy("data", "desc"), startAfter(lastDoc), limit(5));
        const querySnapshot = await getDocs(q);
        await updateState(querySnapshot);

    }

    if(loading){
        return(
            <div>
                <Header/>

                <div className="content">
                    <Title name="Tickets">
                        <FiMessageSquare size={25} />
                    </Title>

                    <div className="container dashboard">
                        <span>Buscando chamados...</span>
                    </div>
                </div>
            </div>
        )
     
    }

    return(
        <div>
            <Header/>

            <div className="content">
                <Title name="Tickets">
                    <FiMessageSquare size={25} />
                </Title>

                <>

                    {callingList.length === 0 ? (
                        <div className="container dashboard">
                            <span>Nenhum chamado encontrado...</span>
                            <Link to="/new" className="new">
                                <FiPlus color="#FFF" size={25} />
                                Novo Chamado
                            </Link>
                        </div>
                    ): (
                        <>
                            <Link to="/new" className="new">
                                <FiPlus color="#FFF" size={25} />
                                Novo Chamado
                            </Link>
                            
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Assunto</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Cadastrado em</th>
                                        <th scope="col">#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {callingList.map((item, index) => {
                                        return(
                                            <tr key={index}>
                                                <td data-label="Cliente">{item.client}</td>
                                                <td data-label="Assunto">{item.subject}</td>
                                                <td data-label="Status">
                                                    <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'}}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td data-label="Cadastrado">{item.createdFormat}</td>
                                                <td data-label="#">
                                                    <button className="action" style={{ backgroundColor : '#3583f6'}}>
                                                        <FiSearch color="#fff" size={17} />
                                                    </button>
                                                    <button className="action"  style={{ backgroundColor : '#f6a935'}}>
                                                        <FiEdit2 color="#fff" size={17} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                            {loadingPagination && <h3>Buscando mais chamados...</h3>}
                            {!loadingPagination && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button>}
                        </>
                    )}
                    
                    
                </>
            </div>
            
        </div>
    )
}