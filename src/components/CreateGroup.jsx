import { Form } from "react-bootstrap";
import CenteredOverlayForm from "./shared/CenteredOverlayForm";
import { useSetRecoilState } from 'recoil';
import { groupNameState } from "../state/groupName";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

const CreateGroup = () => {
  const setGroupName = useSetRecoilState(groupNameState);
  const [validated, setValidated] = useState(false);
  const [validGroupName, setValidGroupName] = useState(false);
  const navagate = useNavigate();

  const TITLE = '먼저, 더치 페이 할 그룹의 이름을 정해볼까요?'

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity()) {
      setValidGroupName(true);
      navagate(`${ROUTES.ADD_MEMBERS}`);
    } else {
      event.stopPropagation();
      setValidGroupName(false);
    }
    setValidated(true);
  };

  return (
    <CenteredOverlayForm title={TITLE}
      validated={validated}
      handleSubmit={handleSubmit}
    >
      <Form.Group controlId="validataionGroupName">
        <Form.Control
          type="text"
          required
          placeholder="2022 제주도 여행"
          onChange={(event) => setGroupName(event.target.value)}
        />
        <Form.Control.Feedback type="invalid" data-valid={validGroupName}>그룹 이름을 입력해 주세요</Form.Control.Feedback>
      </Form.Group>
    </CenteredOverlayForm>
  )
};

export default CreateGroup;
