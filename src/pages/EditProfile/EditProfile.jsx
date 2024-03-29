import "./EditProfile.css"

import {uploads} from "../../utils/config";

//Hooks
import {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useResetComponentMessage} from "../../hooks/useResetComponentMessage"

//Redux
import {profile, updateProfile} from "../../slices/userSlice";

//Components
import Message from "../../components/Message";




const EditProfile = () => {

    const dispatch = useDispatch();

    const resetMessage = useResetComponentMessage(dispatch);

    const {user, message, error, loading} = useSelector((state) => state.user);

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [profileImage, setImageProfile] = useState("")
    const [bio, setBio] = useState("")
    const [previewImage, setPreviewImage] = useState("")


    //Executa a funão do redux 
    useEffect(() => {
        dispatch(profile())
    }, [dispatch])


    //Seta o usuario no State e coloca no formulario
    useEffect(() => {

        if(user){

            setName(user.name)
            setEmail(user.email)
            setBio(user.bio)    

        }
    }, [user])


    const handleSubmit = async (e) => {

        e.preventDefault();


        //Gather user data from states

        const userData = {
            name
        }
            
        if(profileImage){
            userData.profileImage = profileImage;
        }

        if(bio){
            userData.bio = bio;
        }

        if(password){
            userData.password = password;
        }

        
        //Bild form data
        const formData = new FormData();

        const userFormData = Object.keys(userData).forEach((key) => {
            formData.append(key, userData[key])
        });

        formData.append("user", userFormData);


        await dispatch(updateProfile(formData));


        resetMessage();

    }


    const handleFile = (e) => {

        const image = e.target.files[0]

        //Image preview
        setPreviewImage(image);

        //update umage state
        setImageProfile(image);
    }



  return (
    <div id="edit-profile">
        <h2>Edite seus dados</h2>
        <p className="subtitle">Adicione uma imagem de perfil e conte mais sobre você...</p>

        {(user.profileImage && user.profileImage || previewImage) ? (
            
            <img className="profile-image" 
            
                src={
                    previewImage ? URL.createObjectURL(previewImage) : `${uploads}/users/${user.profileImage}`
                } 
                
                alt={user.name} 
                
            />
    
        ):(
            <img className="profile-image" src={`${uploads}/users/user.jpg`} alt={user.name} />
        )}

        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Nome" onChange={(e) => setName(e.target.value)} value={name || ""}/>
            <input type="email" placeholder="E-mail" disabled  onChange={(e) => setEmail(e.target.value)} value={email || ""}/>
            <label>
                <span>Imagem do Perfil:</span>
                <input type="file" onChange={handleFile}/>
            </label>
            <label>
                <span>Bio:</span>
                <input type="text" placeholder="Descrição do perfil" onChange={(e) => setBio(e.target.value)} value={bio || ""}/>
            </label>
            <label>
                <span>Quer alterar sua senha?</span>
                <input type="password" placeholder="Digite sua nova senha" onChange={(e) => setPassword(e.target.value)} value={password || ""}/>
            </label>
            {!loading && <input type="submit"  value="Atualizar"/>}
            {loading && <input type="submit" value="Aguarde" disabled/>}
            {error && <Message msg={error} type={"error"}/>}
            {message && <Message msg={message} type={"success"}/>}
        </form>
    </div>
  )
}

export default EditProfile