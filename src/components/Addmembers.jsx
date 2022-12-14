import { InputTags } from "react-bootstrap-tagsinput"
import { useRecoilState, useRecoilValue } from 'recoil';
import CenteredOverlayForm from './shared/CenteredOverlayForm';
import { groupMembersState } from '../state/groupMembers';
import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { groupNameState } from '../state/groupName';
import styled from 'styled-components'
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

const Addmembers = () => {
  const [groupMembers, setGroupMembers] = useRecoilState(groupMembersState);
  const groupName = useRecoilValue(groupNameState);
  const [validated, setValidated] = useState(false);
  const [groupMembersString, setGroupMembersString] = useState('')
  const navigate = useNavigate();

  const TITLE = `${groupName} 그룹에 속한 사함들의 이름을 모두 적어 주세요.`;

  const handleSubmit = (event) => {
    event.preventDefault();
    setValidated(true);
    if (groupMembers.length > 0) {
      navigate(`${ROUTES.EXPENSE_MAIN}`)
    }
    //  삼성 인터넷이라 태그가 동작하지 않을 때
    else if (isSamsungInternet && groupMembersString.length > 0) {
      setGroupMembers(groupMembersString.split(','))
    }
  };

  const isSamsungInternet = window.navigator.userAgent.includes('SAMSUMG');

  return (
    <CenteredOverlayForm title={TITLE} validated={validated} handleSubmit={handleSubmit}>
      {isSamsungInternet ? (
        <Form.Control
          placeholder="이름 간 컴마(,)로 구분"
          onChange={({ target }) => setGroupMembersString(target.value)}
        />
      ) : (
        <InputTags
          values={groupMembers}
          data-testid="input-member-names"
          placeholder="이름 간 띄어 쓰기"
          onTags={(value) => setGroupMembers(value.values)}
        />
      )}
      {validated && groupMembers.length === 0 && (
        <StyledErrorMessage>그룹 멤버들의 이름을 입력해 주세요</StyledErrorMessage>
      )
      }
    </CenteredOverlayForm>
  )
}

export default Addmembers;

const StyledErrorMessage = styled.span`
  color: red;
`