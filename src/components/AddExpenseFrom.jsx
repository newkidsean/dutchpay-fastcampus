import React, { useState } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { groupMembersState, } from '../state/groupMembers';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { expensesState } from '../state/expenses';
import styled from 'styled-components';
import { API } from 'aws-amplify';
import { groupIdState } from '../state/groupId';

const AddExpenseFrom = () => {
  const [validated, setValidated] = useState(false);
  const members = useRecoilValue(groupMembersState);
  const guid = useRecoilValue(groupIdState);
  const today = new Date();
  const [date, setDate] = useState(
    [today.getFullYear(), today.getMonth() + 1, today.getDate()].join('-')
  );
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState(0)
  const [payer, setPayer] = useState(null);
  const [isDescValid, setIsDescValid] = useState(false);
  const [isAmountValid, setIsAmountValid] = useState(false);
  const [isPayerValid, setIsPayerValid] = useState(false);


  const setExpense = useSetRecoilState(expensesState)
  const expenses = useRecoilValue(expensesState)
  console.log(expenses);

  const checkFormValidity = () => {
    const descValid = desc.length > 0;
    const payerValid = payer !== null;
    const amountValid = amount > 0;

    setIsDescValid(descValid);
    setIsPayerValid(payerValid);
    setIsAmountValid(amountValid);

    return descValid && payerValid && amountValid;
  }

  const saveExpense = (expense) => {
    API.put('groupsApi', `/groups/${guid}/expenses`, {
      body: {
        expense
      }
    })
      .then(_response => {
        setExpense(expenses => [
          ...expenses,
          expense,
        ])
      }
      )
      .catch(_error => {
        alert('비용 추가에 실패했습니다.')
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (checkFormValidity()) {
      const newExpense = {
        date, amount, desc, payer
      }
      saveExpense(newExpense);
    }
    setValidated(true);
  }

  return (
    <StyledWrapper>
      <Form noValidate onSubmit={handleSubmit}>
        <StyledTitle>1. 비용 추가하기</StyledTitle>
        <Row>
          <Col xs={12}>
            <StyledFormGroup>
              <Form.Control
                type='date'
                placeholder='결제한 날짜를 선택해 주세요'
                value={date}
                onChange={event => setDate(event.target.value)}
              />
            </StyledFormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <StyledFormGroup>
              <Form.Control
                type='text'
                isValid={isDescValid}
                isInvalid={!isDescValid && validated}
                placeholder='비용에 대한 설명을 입력해 주세요'
                value={desc}
                onChange={({ target }) => setDesc(target.value)}
              />
              <Form.Control.Feedback type='invalid' data-valid={isDescValid} >
                비용 내용을 입력해 주셔야 합니다.
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs={12} lg={6}>

            <StyledFormGroup>
              <Form.Control
                type='number'
                isValid={isAmountValid}
                isInvalid={!isAmountValid && validated}
                placeholder='비용은 얼마였나요?'
                value={amount}
                onChange={({ target }) => setAmount(target.value)}
              />
              <Form.Control.Feedback type='invalid' data-valid={isAmountValid}>
                1원 이상의 금액을 입력해 주셔야 합니다.
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>

          <Col xs={12} lg={6}>

            <StyledFormGroup>
              <Form.Select
                className='form-control'
                defaultValue=''
                isValid={isPayerValid}
                isInvalid={!isPayerValid && validated}
                onChange={({ target }) => setPayer(target.value)}
              >
                <option disabled value=''>누가 결제했나요?</option>
                {members.map(member =>
                  <option key={member} value={member}>{member}</option>
                )}
              </Form.Select>
              <Form.Control.Feedback type='invalid' data-valid={isPayerValid}>
                결제자를 선택해 주셔야 합니다.
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs={12} className="d-grid gap-2" >
            <StyledSubmitButton>추가하기</StyledSubmitButton>
          </Col>
        </Row>

      </Form >
    </StyledWrapper >
  )
}

export default AddExpenseFrom;

const StyledWrapper = styled.div`
  padding: 50px;
  background-color: #683BA1;
  box-shadow: 3px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;

  `;
const StyledFormGroup = styled(Form.Group)`
  margin-bottom: 15px;
  input, select {
    background: #59359A;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    border: 0px;
    color: #F8F9FA;
    height: 45px;
  
    &:focus {
      color: #F8F9FA;
      background: #59359A;
      filter: brightness(80%);
    }
    ::placeholder {
      color: #F8F9FA;
    }
  }
`
export const StyledTitle = styled.h3`
  color:#F8F9FA;
  text-align: center;
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
  letter-spacing: 0.25px;
  margin-bottom: 15px;
`
const StyledSubmitButton = styled(Button).attrs({
  type: 'submit',
})`
height: 60px;
border-radius: 8px;
background-color: #E2D9F3;
color: #6610F2;
border: 0px;
padding: 16px 32px;
margin-top: 10px;

&:hover, &:focus {
  background-color: #6610F2;
  filter: rgba(0, 0, 0, 0.3)
}
`