import {auth, provider} from "../firebase-config";
import { signInWithPopup } from "firebase/auth";

export const Auth = () => {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider);

};

    return (
      <div className="auth">
        <p>Sign In With Google</p>
        <button onClick={signInWithGoogle}>Sign in</button>
      </div>
    );
  };