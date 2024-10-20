import React from 'react';

export const ErrorMessage = ({ message }) => (
  <div className="alert alert-danger" role="alert">
    {message}
  </div>
);