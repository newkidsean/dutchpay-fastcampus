import React from 'react'
import { Container } from 'react-bootstrap';
import styled from 'styled-components'
import OverlayWrapper from './shared/OverlayWrapper';

const CenteredOverlayForm = ({ children }) => {
  return (
    <CentralizedContainer>
      <StyledHeader>Dutch Pay</StyledHeader>
      <OverlayWrapper>
        {children}
      </OverlayWrapper>
    </CentralizedContainer>
  )
}

export default CenteredOverlayForm;

const CentralizedContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 10px;
  width: 50vw;
  min-height: 100vh;
`;

const StyledHeader = styled.h1`
  font-weight: 200;
  letter-spacing: 10px;

`