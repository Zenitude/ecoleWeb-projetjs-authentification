/* Public */
const btnInscription = document.querySelector('#btn-inscription');
const btnConnection = document.querySelector('#btn-connection');
const btnDeconnection = document.querySelector('#btn-deconnection');
let contenu = document.querySelector('#contenu');
let msgInscription = document.querySelector('#msgInscription');
let msgErreurMail = document.querySelector('#erreurMail');
let msgErreurMdp = document.querySelector('#erreurMdp');
let h1 = document.querySelector('h1');

/* Formulaire inscription */
const formInscription = document.querySelector('#form-inscription');
const emailInscription = document.querySelector('#mailInscription');
const mdpInscription = document.querySelector('#mdpInscription');
const btnInscrire = document.querySelector('#btn-inscrire');

/* Formulaire connection */
const formConnection = document.querySelector('#form-connection');
const emailConnection = document.querySelector('#mailConnection');
const mdpConnection = document.querySelector('#mdpConnection');
const btnConnecter = document.querySelector('#btn-connecter');

/* Événéments */
btnConnection.addEventListener('click', connection);
btnInscription.addEventListener('click', inscription);
btnDeconnection.addEventListener('click', deconnection);
formInscription.addEventListener('submit', envoieFormInscription);
formConnection.addEventListener('submit', envoieFormConnection);

/* Fonctions d'inscription */

function inscription(e)
{
    e.preventDefault();
    
    formConnection.style.display = 'none';
    formInscription.style.display = 'block'; 
    contenu.style.display = 'none';
}

function envoieFormInscription(e)
{
    e.preventDefault();

    let mail = emailInscription.value;
    let mdp = mdpInscription.value;

    auth.createUserWithEmailAndPassword(mail, mdp).then(user => 
    {
        console.log(user);
        msgInscription.innerText = 'Inscription réussie !'
        msgInscription.style.color = 'green'
    }).catch((error) => 
    {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
    });

    formInscription.reset();
}

/* Fonctions de connection */

function connection(e)
{
    e.preventDefault();
    formConnection.style.display = 'block';
    formInscription.style.display = 'none'; 
    contenu.style.display = 'none';
}

function envoieFormConnection(e)
{
    e.preventDefault();

    const mail = emailConnection.value;
    const mdp = mdpConnection.value;

    auth.signInWithEmailAndPassword(mail, mdp).then(user => 
    {
        formConnection.style.display = 'none';
        formInscription.style.display = 'none'; 
        console.log(user);
    }).catch((error) => 
    {
        let errorCode = error.code;
        let errorMessage = error.message;

        if(errorCode === 'auth/user-not-found' && errorMessage === 'There is no user record corresponding to this identifier. The user may have been deleted.')
        {
            msgErreurMail.style.color = 'red';
            msgErreurMail.style.fontWeight = 'bold';
            msgErreurMail.innerText = "Il n’y a aucun enregistrement correspondant à ce mail. L’utilisateur a peut-être été supprimé.";
            msgErreurMdp.innerText = '';
            emailConnection.style.border = "2px solid red";
        }
        else if (errorCode = 'auth/wrong-password' && errorMessage === 'The password is invalid or the user does not have a password.')
        {
            msgErreurMdp.style.color = 'red';
            msgErreurMdp.style.fontWeight = 'bold';
            msgErreurMail.innerText = "";
            msgErreurMdp.innerText = "Le mot de passe est invalide ou l’utilisateur n’a pas de mot de passe.";
            mdpConnection.style.border = "2px solid red";
        }
        else if (errorCode === 'Access to this account has been temporarily disabled due to many failed login attempts.' && errorMessage === 'You can immediately restore it by resetting your password or you can try again later.')
        {
            msgErreurMail.style.color = 'red';
            msgErreurMail.style.fontWeight = 'bold';
            msgErreurMail.innerHTML = "L’accès à ce compte a été temporairement désactivé en raison de nombreuses tentatives de connexion échouées.<br>Veuillez contacter nos services pour plus d'informations.";
            msgErreurMdp.innerText = '';
            emailConnection.style.border = "2px solid red";
        }
        else
        {
            console.log(errorCode);
            console.log(errorMessage);
        }
        
    });
}

/* Fonction de déconnection */

function deconnection(e)
{
    e.preventDefault();

    auth.signOut().then(() => 
    {
        formConnection.style.display = 'none';
        formInscription.style.display = 'none';  
        contenu.style.display = 'block'; 
        contenu.innerHTML = "Contenu public.<br>Vous n'êtes plus connecté.";
    }).catch((error) => 
    {
        let errorCodeDeco = error.code;
        let errorMsgDeco = error.message;
        console.log(errorCodeDeco);
        console.log(errorMsgDeco);
    });
}

/* Gérer le contenu */

auth.onAuthStateChanged(utilisateur => 
{
    if(utilisateur)
    {
        contenu.style.display = 'block';
        contenu.innerHTML = `Contenu privé.`
        h1.innerText = 'Vous voilà de retour !'
    }
    else
    {
        contenu.style.display = 'block';
        contenu.innerHTML = `Contenu public.`
        h1.innerText = 'Bienvenue, inscrivez-vous ou connectez-vous.'
    }
});