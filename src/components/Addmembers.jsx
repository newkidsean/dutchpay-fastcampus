import { InputTags } from "react-bootstrap-tagsinput"
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import CenteredOverlayForm from './shared/CenteredOverlayForm';
import { groupMembersState } from '../state/groupMembers';
import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import styled from 'styled-components'
import { useNavigate } from "react-router-dom";
import { ROUTES, ROUTE_UTILS } from "../routes";
import { API } from "aws-amplify";
import { useGroupData } from '../hooks/useGroupData';

const Addmembers = () => {
  const { groupId, groupMembers, groupName } = useGroupData();

  const setGroupMembers = useSetRecoilState(groupMembersState);
  const [validated, setValidated] = useState(false);
  const [groupMembersString, setGroupMembersString] = useState('')
  const navigate = useNavigate();

  const TITLE = `${groupName} 그룹에 속한 사함들의 이름을 모두 적어 주세요.`;

  const saveGroupMembers = () => {
    API.put('groupsApi', `/groups/${groupId}/members`, {
      body: {
        members: groupMembers
      }
    })
      .then(_response => {
        navigate(ROUTE_UTILS.EXPENSE_MAIN(groupId))
      })
      .catch(error => {
        console.log(error.response);
        alert(error.response.data.error)
      })
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    setValidated(true);
    if (groupMembers.length > 0) {
      saveGroupMembers();
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