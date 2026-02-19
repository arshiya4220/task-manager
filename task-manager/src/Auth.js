import Login from "./Login";
import Register from "./Register";
import { useState } from "react";

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="container">
      {isRegister ? (
        <>
          <Register onSwitch={() => setIsRegister(false)} />
        </>
      ) : (
        <>
          <Login onLogin={onLogin} />
          <p>
            No account?{" "}
            <button onClick={() => setIsRegister(true)}>Register</button>
          </p>
        </>
      )}
    </div>
  );
}
