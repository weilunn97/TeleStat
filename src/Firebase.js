import firebase from "firebase/app";
import "firebase/storage";

class Firebase {
  generateConfig = () => ({
    apiKey: "AIzaSyC5dwq14duK6nYbwSwYKjOEs8_A97Ho7wU",
    authDomain: "telestat-817a8.firebaseapp.com",
    databaseURL: "https://telestat-817a8.firebaseio.com",
    projectId: "telestat-817a8",
    storageBucket: "telestat-817a8.appspot.com",
    messagingSenderId: "433175668589",
    appId: "1:433175668589:web:4c07351901f9e195239c64",
    measurementId: "G-Y8JW90LD8X"
  });

  uploadFile = (file, storageRef) => {
    const config = this.generateConfig();
    firebase.initializeApp(config);
    const name = file.name;
    const uploadTask = storageRef.child(name).put(file);
    uploadTask.on(
      "state_changed",
      function(snapshot) {},
      error => alert("Firebase Upload Failed")
    );
  };
}

export default Firebase;
