// src/components/MetaTag.js
import React from 'react';
import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types';

const MetaTag = ({ title }) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>
    </Helmet>
  );
};

MetaTag.propTypes = {
  title: PropTypes.string.isRequired
};

export default MetaTag;
