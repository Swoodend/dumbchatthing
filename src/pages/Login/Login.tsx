import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

type LoginResponsePayload = {
  email: string;
  id: number;
  username: string;
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = (event.currentTarget.elements[0] as HTMLInputElement).value;
    const password = (event.currentTarget.elements[1] as HTMLInputElement)
      .value;

    const loginUser = async (): Promise<LoginResponsePayload | void> => {
      if (!email || !password) return;

      const res = await fetch(process.env.API_URL + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        return await res.json();
      } else {
        throw new Error('Unable to register user!');
      }
    };

    const responsePayload = await loginUser();

    if (responsePayload) {
      login(responsePayload.id, responsePayload.username);
      navigate('/');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <h1>{process.env.API_URL}</h1>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input type="text" name="email" />

        <label>password</label>
        <input type="password" name="password" />
        <button type="submit" value="submit" hidden />
      </form>
      <p>
        New user? <Link to="/register">Register</Link> instead
      </p>
    </div>
  );
};

export default Login;
