import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <article>
      <section className="error-message">
        <div className="summary">Oh my, the page faild to load.</div>
        <div className="error">{message}</div>
      </section>
    </article>
  );
};

export default ErrorMessage;
