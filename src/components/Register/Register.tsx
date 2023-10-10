import { Link } from 'react-router-dom';

const Register = () => {
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = (event.currentTarget.elements[0] as HTMLInputElement).value;
    const password = (event.currentTarget.elements[1] as HTMLInputElement)
      .value;

    if (!email || !password) return;

    fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
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
