import React from 'react'
import { Button, Container, Form, Row } from 'react-bootstrap';
import styled from 'styled-components'
import OverlayWrapper from './OverlayWrapper';

const CenteredOverlayForm = ({ title, children, validated, handleSubmit }) => {
  return (
    <CentralizedContainer>
      <StyledLogo>Dutch Pay</StyledLogo>
      <OverlayWrapper>
        <Container>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <StyledRow>

              <Row className="align-items-start">
                <StyledTitle>{title}</StyledTitle>
              </Row>

              <Row className="align-items-center">
                {children}
              </Row>

              <Row className="align-items-end">
                <SubmitButton>저장</SubmitButton>
              </Row>
            </StyledRow>
          </Form>
        </Container>

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

const StyledLogo = styled.h1`
  font-weight: 200;
  letter-spacing: 10px;

`;


const StyledRow = styled(Row)`
  height: 60vh;
  justify-content: center;
  align-items: center;
`;

const SubmitButton = styled(Button).attrs({
  type: 'submit',
})`
background-color: #6610F2;
border-radius: 8px;
border: none;

&:hover {
  background-color: #6610F2;
  filter: brightness(80%);
}
`;

const StyledTitle = styled.h2`
  text-align: right;
  overflow-wrap: break-word;
  word-break: keep-all;
  font-weight: 700;
  line-height: 35px;
`