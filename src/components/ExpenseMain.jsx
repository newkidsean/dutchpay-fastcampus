import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import AddExpenseFrom from './AddExpenseFrom'
import ExpenseTable from './ExpenseTable'
import { groupNameState } from '../state/groupName';

const ExpenseMain = () => {
  return (
    <Container fluid>
      <Row>
        <Col xs={12} sm={5} md={4}>
          <LeftPane />
        </Col>
        <Col>
          <RightPane />
        </Col>
      </Row>
    </Container>
  )
}

const LeftPane = () => {
  return (
    <Container>
      <AddExpenseFrom />

    </Container>
  )
}
const RightPane = () => {
  const groupName = useRecoilValue(groupNameState);
  return (
    <StyledContainer>
      <Row>
        <StyledGroupName>{groupName || 'Group Name'}</StyledGroupName>
      </Row>
      <Row>
        <ExpenseTable />
      </Row>

    </StyledContainer>
  )
}

export default ExpenseMain;

const StyledContainer = styled(Container)`
  padding: 100px 31px;
`;

const StyledGroupName = styled.h2`
  margin-bottom: 80px;
  font-weight: 700;
  font-size: 48px;
  line-height: 48px;
  text-align: center;
`