import React from 'react';
import styled from 'styled-components';

const ServiceLogo = () => {
  return (
    <StyledLogo>Dutch Pay</StyledLogo>
  )
}

export default ServiceLogo;

const StyledLogo = styled.h1`
  font-weight: 200;
  letter-spacing: 10px;
  color: slateblue;
  text-align: center;
  margin-bottom: 0.8em;
`;