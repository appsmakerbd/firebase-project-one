import './App.css';
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase/app";
// Add the Firebase services that you want to use
import "firebase/auth";

import firebaseConfig from './firebase.config';
import { useState } from 'react';

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}




function App() {
  const[userInfo,setUserInfo]=useState({
    isSignedIn:false,
    name:'',
    email:'',
    password:'',
    photo:'',
    error:''
  });

  //Provider
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();



  //Handle Google Signin
  const handleSignIn=()=>{
    firebase.auth().signInWithPopup(googleProvider)
    .then(res => {
      //console.log(res);
      const {displayName,photoURL,email}=res.user;
      const signedInUser={
        isSignedIn:true,
        name:displayName,
        email:email,
        password:'',
        photo:photoURL,
        error:''
      }
      setUserInfo(signedInUser);
    }).catch(error=>{
      console.log(error);
    })
  }



  //Handle Facebook Sign In

  const handleFbSignIn=()=>{
    firebase.auth().signInWithPopup(fbProvider)
    .then(res =>{
      //console.log(res)
      const {displayName,photoURL,email}=res.user;
      const signedInUser={
        isSignedIn:true,
        name:displayName,
        email:email,
        password:'',
        photo:photoURL,
        error:''
      }
      setUserInfo(signedInUser);
    }).catch(error=>{
      console.log(error);
    })
  }






  const handleSignOut=()=>{
    firebase.auth().signOut()
    .then(()=>{
      //console.log('signed out');
      const signedOutUser={
        isSignedIn:false,
        name:'',
        email:'',
        password:'',
        photo:'',
        error:''
      }
      setUserInfo(signedOutUser);
    }).catch(error=>{
      console.log(error)
    })
  }


  //Custom Sign in area

  //Error Handling using Regular expression
  const handleBlur=(event)=>{
    let isFormValidate=true;
    const targetName=event.target.name;
    const targetValue=event.target.value;
    //console.log(event.target.name,event.target.value)
    if(targetName==='email'){
      const regExp=/\S+@\S+\.\S+/
      const isEmailValidate=regExp.test(targetValue);
      isFormValidate=isEmailValidate;
      //console.log(isEmailValidate)
    }

    if(targetName==='password'){
      const regExpPass=/\d{1}/
      const passHasNumber=regExpPass.test(targetValue);
      const isPassValidate=targetValue.length>7 && passHasNumber;
      isFormValidate=isPassValidate;
      //console.log(isPassValidate)
    }

    if(isFormValidate){
      //copying object data from state
      const newUserInfo={...userInfo}
      //assigning new value
      newUserInfo[targetName]=targetValue;
      setUserInfo(newUserInfo);
    }else{
      const newUserInfoFalse={...userInfo}
      newUserInfoFalse[targetName]="";
      setUserInfo(newUserInfoFalse);
    }
  } 

//console.log(userInfo);


  //Submitting the form and inserting into firebase
  const handleSubmit=(event)=>{
    if(userInfo.name && userInfo.password){
      //console.log('You are ready for signup');
      const email=userInfo.email;
      const password=userInfo.password;


      //Firebase code
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(res => {
          // Signed in 
          //var user = userCredential.user;
          console.log(res);
          const newUserSuccess={...userInfo}
          newUserSuccess.error='';
          setUserInfo(newUserSuccess)
          // ...
        })
        .catch((error) => {
          //var errorCode = error.code;
          var errorMessage = error.message;
          //console.log(errorMessage)
          //console.log(errorCode)
          const newUserError={...userInfo}
          newUserError.error=errorMessage;
          setUserInfo(newUserError)
          // ..
        });
    }else{
      event.preventDefault();
    }
    event.preventDefault();
  }








  


  //const name=displayName?displayName : 'No User FOund';
 // const photo=photoURL?photoURL : 'No Photo';
  
  return (
    <div className="App">
      {
        userInfo.isSignedIn? <button onClick={handleSignOut}>Sign Out</button> :  <button onClick={handleSignIn}>Sign in Using Google</button>
      }

      <button onClick={handleFbSignIn}>Signin Using Facebook</button>
      
      {
        userInfo.isSignedIn && <div>
            <h1>Welcome {userInfo.name}</h1>
            <img src={userInfo.photo} alt={userInfo.photo}/>
          </div>
      }


      <div>
        <h1>Custom User Signup</h1>
        {
          userInfo.error && <p style={{color:'red'}}>{userInfo.error}</p>
        }
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" onBlur={handleBlur} placeholder="Full Name" /><br/>
          <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email Address" /><br/>
          <input type="password" name="password"  onBlur={handleBlur}  placeholder="Write Password" /><br/>
          <input type="submit" value="Sign Up" />
        </form>
      </div>
      
    </div>
  );
}

export default App;
