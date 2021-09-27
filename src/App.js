import { initializeApp } from 'firebase/app';
import { } from 'firebase/auth';
import './App.css';
import firebaseConfig from './firebase.config';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, FacebookAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup, signOut, } from "firebase/auth";
import { useState } from 'react';

initializeApp(firebaseConfig);


function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false
  })

  const provider = new GoogleAuthProvider();
  

  const handleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const { displayName, photoURL, email } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
      })
      .catch(err => {
        console.log(err);
        console.log(err.massage);
      })
  }

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      const signOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: ''
      }

      setUser(signOutUser);
    }).catch(error => {
      console.log(error);
    })
  }

  const handleBlur = (event) => {

    let isFieldValid = true;
    if (event.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value)
    }
    if (event.target.name === 'password') {
      isFieldValid = event.target.value.length > 6 && /\d{1}/.test(event.target.value);

    }
    if (isFieldValid) {
      //[...cart, newCart]
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (event) => {
    if (newUser && user.email && user.password) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name)
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo)
        });
    }

    if (!newUser && user.email && user.password) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo)
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo)
        });

    }
    event.preventDefault()
  }


  const updateUserName = name => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: name,
    }).then(() => {

    }).catch((error) => {

    });
  }

  const fbProvider = new FacebookAuthProvider();
  const handleFb = () => {
    const auth = getAuth();
    signInWithPopup(auth, fbProvider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        console.log(accessToken);

        // ...
      })
      .catch((error) => {
        console.log(error.message);
      });
  }


  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div>
        {
          user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> : <button onClick={handleSignIn}>Sign in</button>
        }<br />
        <button onClick={handleFb}>Login using Facebook</button>
        {
          user.isSignedIn &&
          <div>
            <p>Welcome {user.name}</p>
            <img src={user.photo} alt="" />
          </div>
        }
        <h1>Self Authenication</h1>
        <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
        <label htmlFor="newUser">New User SignUp</label>
        <form onSubmit={handleSubmit}>
          {newUser && <input onBlur={handleBlur} type="text" name="name" placeholder="Enter Your Name" required />}
          <br />
          <input onBlur={handleBlur} type="email" name="email" required placeholder='Enter your email' />
          <br />
          <input onBlur={handleBlur} type="password" name="password" id="" required placeholder='enter your password' />
          <br />
          <input type="submit" value={newUser ? 'Sign up' : 'Sign in'} />
        </form>
        {
          user.success ? <h1 style={{ color: "green" }}>User {newUser ? 'Created' : 'Logged In'} Succes</h1 > : <h1 style={{ color: 'red' }}>{user.error}</h1>
        }
      </div>
    </div>
  );
}

export default App;
