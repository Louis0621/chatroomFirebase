import './App.css';
import {initializeApp} from 'firebase/app';
import {GoogleAuthProvider, getAuth} from 'firebase/auth';
import { collection, getFirestore, doc, getDocs, deleteDoc, addDoc} from 'firebase/firestore';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useState } from 'react';
const firebaseConfig = {
  apiKey: "AIzaSyB0IAcL9O-mSktThE04Zo5lppKayW83Is4",
  authDomain: "chatroom-9e07f.firebaseapp.com",
  projectId: "chatroom-9e07f",
  storageBucket: "chatroom-9e07f.appspot.com",
  messagingSenderId: "529911839466",
  appId: "1:529911839466:web:1a658248aabe9017007593",
  measurementId: "G-C2LK7X61DN"
};
//Auth
const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);


function App() {
  
  //Ref
  const messagesCollectionRef = collection(db, "messages");

  //State
  const [show, setShow] = useState(false);
  const [curr, setCurr] = useState('');
    //Firestore
  const [content, setContent] = useState("");
  const [contentList, setContentList] = useState([]);
  const confirm = ()=>{
  
    if(auth.currentUser){
      setShow(true);
    }
    else{
      setShow(false);
    }
  }
  // useEffect(()=>{
  //   confirm();
  //   console.count("re-rendered");
  // },[show]);
  const signInWithGoogle = async()=>{
    await signInWithPopup(auth, googleProvider);
    confirm();
    getContentList(); 
  }
  const logOut = async()=>{
    try{
      await signOut(auth, googleProvider);
      confirm();
        
      getContentList(); 
    }catch(err){
      console.error(err);
    }
  }
  
  const handleOnclick = async(e)=>{
    if(content === '') return;
    const time = new Date();
    setCurr(()=>{return time.toLocaleString()});
    await addDoc(messagesCollectionRef, {
      content: content,
      createdAt: curr,
      user: auth.currentUser.displayName  
    })
    setContent('');

    
    getContentList(); 
  }
  const getContentList = async()=>{
    const messages = await getDocs(messagesCollectionRef);
    const data = messages.docs.map((doc)=>({
      ...doc.data(),
      id: doc.id
      // This is needed. We need id in order to delete or update the data.
    }));
    setContentList(data);
   }
  const handleDelete = async(id)=>{
    const messageDoc = doc(db, 'messages', id);
    await deleteDoc(messageDoc);
    getContentList(); 
  }
  return (
    <main className="App">
      <header className="App-header">
        <div className='header'>
          Welcome to Our Chatroom
          <br/>
          Current User: {auth.currentUser?.displayName}
          <br/>
          {auth.currentUser ?<img className='image' src={auth.currentUser?.photoURL} alt='none'/> : ''}
        </div>

        <div className='sign'>
            {
              show === false ? 
              <div>
                <button  onClick={signInWithGoogle}>Sign In With Google</button>
              </div>
              :<div>
                <button onClick={logOut}>Sign Out With Google</button>
                <article className='write'>
                  <textarea className='text' value = {content} onChange={(e)=>setContent(e.target.value)}></textarea>
                  <button onClick={handleOnclick}>Submit</button>
                </article>
              </div>
            }
          </div>
      </header>
      <div className='section'>
        
        <div>
            {contentList && contentList.map((cnt, i)=>(
            <div key={i}>
              <p className='information'>
                {cnt.content}
                <button className ='delete' onClick={()=>handleDelete(cnt.id)}>Delete</button>
                <span className='localTime'>
                  {cnt.createdAt ?<span>{cnt.createdAt.toLocaleString()}</span>:''}
                
                </span>
               </p>
              {/* <h1>{cnt.createdAt}</h1> */}
            </div>
          ))}
        </div>
      </div>
      
    </main>
  );
}

export default App;
