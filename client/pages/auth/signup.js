import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'), // Callback when success
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    // try {
    //   const response = await axios.post('/api/users/signup', {
    //     email,
    //     password,
    //   });

    //   console.log(response.data);
    // } catch (err) {
    //   setErrors(err.response.data.errors); // Remember this format !
    // }

    doRequest();
  };

  return (
    <form onSubmit={onSubmit} style={{ padding: '15px' }}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      {/* {errors.length > 0 && ( 
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )} */}
      {errors}
      <button className="btn btn-primary" style={{ marginTop: '15px' }}>
        Sign Up
      </button>
    </form>
  );
};
