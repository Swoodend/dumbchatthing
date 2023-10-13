import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

type RegistrationResponsePayload = {
  userId: number;
  username: string;
};

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = (event.currentTarget.elements[1] as HTMLInputElement).value;
    const username = (event.currentTarget.elements[1] as HTMLInputElement)
      .value;
    const password = (event.currentTarget.elements[2] as HTMLInputElement)
      .value;

    const registerUser =
      async (): Promise<RegistrationResponsePayload | void> => {
        if (!email || !password || !username) return;

        const res = await fetch('http://localhost:3001/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, username }),
        });

        if (res.ok) {
          return await res.json();
        } else {
          throw new Error('Unable to register user!');
        }
      };

    const responsePayload = await registerUser();

    if (responsePayload) {
      login(responsePayload.userId, responsePayload.username);
      navigate('/');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <label>Username</label>
        <input type="text" name="username" />

        <label>Email</label>
        <input type="text" name="email" />

        <label>password</label>
        <input type="password" name="password" />

        <button type="submit" value="submit" hidden />
      </form>
      <p>
        Already signed up? <Link to="/login">login</Link> instead
      </p>
    </div>
  );
};

export default Register;
