import React, { useCallback, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { expensesState } from '../state/expenses';
import { groupMembersState } from '../state/groupMembers';
import { StyledTitle } from './AddExpenseFrom'
import DownloadIcon from './assets/DownloadIcon';
import { toJpeg } from 'html-to-image';

export const calculateMinimumTransaction = (expenses, members, amountPerPerson) => {
  const minTransactions = [];
  if (amountPerPerson === 0) return minTransactions;

  // 1. 사람 별로 냈어야 할 금액
  const membersToPay = {};
  members.forEach(member => {
    membersToPay[member] = amountPerPerson;
  });

  // 2. 사람 별로 정산 받아야 할 금액 업데이트
  // 음수는 더 받아야 할 금액
  // 양수는 더 내야할 금액
  expenses.forEach(({ payer, amount }) => {
    membersToPay[payer] -= amount;
  });

  // 3. amount 별로 오름차순 sorting 한 배열
  const sortedMembersToPay = Object.keys(membersToPay)
    .map(member => (
      { member: member, amount: membersToPay[member] }
    ))
    .sort((a, b) => a.amount - b.amount)


  let left = 0;
  let right = sortedMembersToPay.length - 1;

  while (left < right) {
    while (left < right && sortedMembersToPay[left].amount === 0) {
      left++
    }
    while (left < right && sortedMembersToPay[right].amount === 0) {
      right--
    }

    const toReceive = sortedMembersToPay[left]
    const toSend = sortedMembersToPay[right]
    const amountToReceive = Math.abs(toReceive.amount)
    const amountToSend = Math.abs(toSend.amount)

    if (amountToSend > amountToReceive) {
      minTransactions.push({
        receiver: toReceive.member,
        sender: toSend.member,
        amount: amountToReceive,
      })
      toReceive.amount = 0
      toSend.amount -= amountToReceive
      left++
    }
    else {
      minTransactions.push({
        receiver: toReceive.member,
        sender: toSend.member,
        amount: amountToSend
      })
      toSend.amount = 0
      toReceive.amount += amountToSend
      right--
    }
  }
  return minTransactions;
}
const SettlementSummary = () => {
  const imgRef = useRef(null);
  const expenses = useRecoilValue(expensesState);
  const members = useRecoilValue(groupMembersState);
  // const members = ['A', 'B', 'C', 'D'];

  const totalExpenseAmount = parseInt(expenses.reduce((prevAmount, curExpense) => prevAmount + parseInt(curExpense.amount), 0));
  const groupMembersCount = members.length;
  const splitAmount = totalExpenseAmount / groupMembersCount;

  const minimumTransaction = calculateMinimumTransaction(expenses, members, splitAmount);

  const handleDownloadTransactionImg = useCallback(() => {
    if (imgRef.current === null) return;

    toJpeg(imgRef.current, { cacheBust: true, })
      .then(dataUrl => {
        const link = document.createElement('a');
        link.download = 'transaction.jpeg';
        link.href = dataUrl;
        link.click();
      })
      .catch(err => console.log(err));
  }, [imgRef])

  return (
    <StyledWrapper ref={imgRef}>
      <StyledHeader>
        <StyledTitle>2. 정산은 이렇게!</StyledTitle>
        <div onClick={handleDownloadTransactionImg}>
          <DownloadIcon />
        </div>
      </StyledHeader>
      {totalExpenseAmount > 0 && groupMembersCount > 0 && (
        <>
          <StyledSummary>
            <span>{groupMembersCount} 명이서 총 {totalExpenseAmount} 원 지출</span>
            <br />
            <span>한 사람 당 {splitAmount} 원</span>
          </StyledSummary>

          <StyledUl>
            {minimumTransaction.map(({ receiver, sender, amount }, index) =>
              <li key={`transaction-${index}`}>
                <span>{sender}가 {receiver}에게 {amount} 원 보내기</span>
              </li>
            )}
          </StyledUl>
        </>
      )}
    </StyledWrapper>
  )
}

export default SettlementSummary;

const StyledWrapper = styled.div`
  padding: 50px;
  background-color: #683BA1;
  color: #FFFBFB;
  box-shadow: 3px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  text-align: center;
  font-size: 22px;
  position: relative;
`;

const StyledUl = styled.ul`
  margin-top: 33px;
  font-weight: 600;
  line-height: 200%;

  list-style-type: disclosure-closed;
  li::marker {
    animation: blinker 1.5s linear infinite;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`;

const StyledSummary = styled.div`
  margin-top: 31px;
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: baseline;

  svg {
    margin-left: 20px;
    &:hover {
      cursor: pointer;
    }
  }
`