import { useState, useContext } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { AuthContext } from '../../contexts/auth'
import { FiSettings, FiUpload} from 'react-icons/fi'
import { db, storage } from '../../services/firebaseConnection'
import { doc, updateDoc } from 'firebase/firestore';
import { toast }  from 'react-toastify';
import { ref, uploadBytes, getDownloadURL} from 'firebase/storage'; // o primeiro é pra acessar a referência, o segundo é para enviar fotos, e o terceiro é p pegar a url de retorno da img que foi enviada
import avatar from '../../assets/avatar.png';
import './profile.css'

export default function Profile(){

    const {user, setUser, logout, storageUser} = useContext(AuthContext);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl); // armazena a url do arquivo
    const [imageAvatar, setImageAvatar] = useState(null) //armazenar o arquivo em si

    const [name, setName] = useState(user && user.name);
    const [email, setEmail] = useState(user && user.email);

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0];
            if (image.type === "image/jpeg" || image.type === "image.png"){
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image))
            }
            
            else {
                alert("Envie uma imagem do tipo JPEG ou PNG")
                setImageAvatar(null);
                return;
            }

        }
       
    }

    function handleUpload(){
        const currentUid = user.uid;

        const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`);

        uploadBytes(uploadRef, imageAvatar)
        .then((snapshot) => {

            getDownloadURL(snapshot.ref)
            .then( async (downloadUrl) => {
                let UrlFoto = downloadUrl;

                const docRef = doc(db, "users", user.uid);
                await updateDoc(docRef, {
                    avatarUrl: UrlFoto,
                    nome: name
                })
                .then(() => {
                    let data = {
                        ...user,
                        name: name,
                        avatarUrl: UrlFoto
                    };

                    setUser(data);
                    storageUser(data);
                    toast.success("Atualizado com sucesso!")
                })
            })
        })
    }

    async function handleSubmit(e){
        e.preventDefault();

        if (imageAvatar === null && name  !== ''){
            console.log("hello")
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, {
                nome: name,
            })
            .then(() => {
                let data = {
                    ...user,
                    name: name
                };
                setUser(data);
                storageUser(data);
                toast.success("Atualizado com sucesso!")
            })
        }
        else if (imageAvatar !== null && name !== ''){
            handleUpload();
        }
        
    }

    return(
        <div>
            <Header />

            <div className="content">
                <Title name="Minha conta">
                    <FiSettings size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleSubmit}>
                        <label className="label-avatar">
                            <span> 
                                <FiUpload color="#FFF" size={25} />
                            </span>
                            
                            <input type="file" accept="image/*" onChange={handleFile}/> <br/>
                            {avatarUrl === null ? (
                                <img src={avatar} alt="Foto do perfil" width={250} height={250} /> 
                                ) : (
                                <img src={avatarUrl} alt="Foto do perfil" width={250} height={250} />
                                )  
                            }

                        </label>

                        <label>Nome</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

                        <label>Email</label>
                        <input type="text" value={email} disabled={true} />

                        <button type="submit">Salvar</button>

                    </form>
                </div>

                <div className="container">
                    <button onClick={logout} className="logout-btn">Sair</button>
                </div>
            </div>

            <h1>Pagina perfil</h1>
        </div>
    )
}