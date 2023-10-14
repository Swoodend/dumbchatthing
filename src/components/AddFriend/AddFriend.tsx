import React from 'react';
import { Link } from 'react-router-dom';

const AddFriend = () => {
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      email: { value: string };
    };

    const email = target.email.value;

    // send /post to server
    const res = await fetch(process.env.API_URL + '/add-friend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        friendEmail: email,
      }),
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Something went wrong when sending a friend request');
    }
  };

  return (
    <div>
      <h1>add friend page</h1>
      <Link to="/">Home</Link>

      <div>
        <p>add a friend</p>
        <form onSubmit={onSubmit}>
          <label>Email</label>
          <input type="text" name="email" />
          <button type="submit" value="submit" hidden />
        </form>
      </div>
    </div>
  );
};

export default AddFriend;
