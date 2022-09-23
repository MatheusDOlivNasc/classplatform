import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js';
import {
  getFirestore, collection, getDocs, doc, setDoc, addDoc, deleteDoc, query, orderBy, where
} from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-firestore.js';


const fbApp = initializeApp({
  apiKey: "AIzaSyAgu6As4DlgyYLaYlWu8Q_ETSdqyR0VAwI",
  authDomain: "plataformacursos-fd550.firebaseapp.com",
  projectId: "plataformacursos-fd550",
  storageBucket: "plataformacursos-fd550.appspot.com",
  messagingSenderId: "554812126132",
  appId: "1:554812126132:web:e6b3ac6afa3bb94c4e38e1",
  measurementId: "G-Z9B8WT522H"
});


// Firestore check
const db = getFirestore(fbApp);

export async function read(module, {order, search}) {
  let col = collection(db, module);
  if(search && !order) {
    col = query(col, where(search.data, '==', search.value))
  } else if (!search && order) {
    col = query(col, orderBy(order))
  } else if (search && order) {
    col = query(col, orderBy(order), where(search.data, '==', search.value))
  }
  const snapshot = await getDocs(col);
  const list = snapshot.docs.map(doc => doc.data());
  return list;
}

export async function save(module, item) {
  if (item.id) {
    let docRef = await setDoc(doc(db, module, item.id), item);
    return docRef
  } else {
    let docRef = await addDoc(collection(db, module), item);
    item.id = docRef.id
    docRef = await setDoc(doc(db, module, docRef.id), item);
    return docRef
  }
}

export async function remove(module, item) {
  let docRef = await deleteDoc(doc(db, module, item.id));
  return docRef
}


