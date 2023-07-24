// app/routes/login.tsx
export default function Login() {
  return (
    <form action="/auth/microsoft" method="post">
      <button>Login with Microsoft</button>
    </form>
  );
}
