import { useState, useEffect, useContext } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConnection";
import { addDoc, collection, getDoc, getDocs } from 'firebase/firestore';

import { FiPlusCircle } from "react-icons/fi";
import { toast } from 'react-toastify';
import './new.css';

export default function New(){

    const { user } = useContext(AuthContext);

    const [loadCustomer, setLoadCustomer] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(0);

    const [subject, setSubject] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complement, setComplement] = useState('');


    useEffect(() => {
        async function loadCustomers(){
            const querySnapshot = await getDocs(collection(db, "customers"))
            .then((snapshot) => {
                let list = [];

                snapshot.forEach((doc) => {
                    list.push({
                        id: doc.id,
                        fantasyName: doc.data().nomeFantasia
                    });
                })

                if (snapshot.docs.size === 0){
                    console.log("NENHUMA EMPRESA ENCONTRADA!");
                    setLoadCustomer(false);
                    return;
                }

                setCustomers(list);
                setLoadCustomer(false);
            })
            .catch((error) => {
                console.log("ERRO AO BUSCAR CLIENTES, " + error);
                setLoadCustomer(false);
                setCustomers([]);
            })
        }

        loadCustomers();
    }, [])

    function handleOptionChange(e){
        setStatus(e.target.value);
    }

    async function handleRegister(e){
        e.preventDefault();

        await addDoc(collection(db, "tickets") ,{
            data: new Date(),
            cliente: customers[customerSelected].fantasyName,
            clienteId: customers[customerSelected].id,
            assunto: subject,
            complemento: complement,
            status: status,
            userId: user.uid
        })
        .then(() => {
            toast.success("Chamado registrado!")
            setComplement('');
            setCustomerSelected(0);
        })
        .catch((error) => {
            toast.error("Ops, erro ao registrar!")
            console.log(error)
        })
    }


    return(
        <div>
            <Header />
            <div className="content">
                <Title name="Novo chamado">
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Clientes</label>
                        {loadCustomer ? (
                            <input type="text" disabled={true} value="Carregando..." />
                        ) : (
                            <select value={customerSelected} onChange={(e) => setCustomerSelected(e.target.value)}>
                                {customers.map((item, index) => {
                                    return(
                                        <option key={index} value={index}>
                                            {item.fantasyName}
                                        </option>
                                    ) 
                                })}
                            </select>
                        )
                        }

                        <label>Assunto</label>
                        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Tecnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input
                                type="radio"
                                name="radio"
                                value="Aberto"
                                onChange={handleOptionChange}
                                checked={ status === "Aberto"}
                             />
                             <span>Em aberto</span>

                             <input
                                type="radio"
                                name="radio"
                                value="Progresso"
                                onChange={handleOptionChange}
                                checked={ status === "Progresso"}
                             />
                             <span>Progresso</span>

                             <input
                                type="radio"
                                name="radio"
                                value="Atendido"
                                onChange={handleOptionChange}
                                checked={ status === "Atendido"}
                             />
                             <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea
                            type="text"
                            placeholder="Descreva seu problema (opcional)"
                            value={complement}
                            onChange={(e) => setComplement(e.target.value)}
                        />

                        <button type="submit">Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
        
        
}