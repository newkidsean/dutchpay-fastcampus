import React from 'react'
import styled from 'styled-components';

const OverlayWrapper = ({ children, padding, minHeight }) => {
  return (
    <StyledContainer padding={padding} minHeight={minHeight}>{children}</StyledContainer>
  )
}

export default OverlayWrapper;

const StyledContainer = styled.div`
  background-color: #FFFFFF;
  border-radius: 15px;
  min-height: ${(props) => props.minHeight || '0'};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: ${(props) => props.padding || '5vw'};
`;

