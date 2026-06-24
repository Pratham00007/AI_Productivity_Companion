function Login() {
  const login = () => {
    window.location.href =
      "http://localhost:5000/auth/google";
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        onClick={login}
        style={{
          padding: "15px 25px",
          fontSize: "18px",
        }}
      >
        Login With Google
      </button>
    </div>
  );
}

export default Login;