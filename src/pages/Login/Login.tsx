import { socketEvents } from '../../backend/socket_server/events';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { socket } from '../../socket';

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
      // set logged in state in context so we know who the current user is throughout the app
      login(responsePayload.id, responsePayload.username);
      // emit a CHAT_INIT event, this stores the socket/userId relationship in a map on the server
      socket.emit(socketEvents.CHAT_INIT, responsePayload.id);
      navigate('/');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <h1>{process.env.API_URL}</h1>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input type="text" name="email" value="alice@aol.com" />

        <label>password</label>
        <input type="password" name="password" value="alice" />
        <button type="submit" value="submit" hidden />
      </form>
      <p>
        New user? <Link to="/register">Register</Link> instead
      </p>
    </div>
  );
};

export default Login;
