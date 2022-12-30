import { Button, Container, Form, Row } from "react-bootstrap";
import CenteredOverlayForm from "./CenteredOverlayForm";
import { useRecoilState } from 'recoil';
import { groupNameState } from "../state/groupName";
import { useState } from "react";

const CreateGroup = () => {
  const [groupName, setGroupName] = useRecoilState(groupNameState);
  const [validated, setValidated] = useState(false);
  const [validGroupName, setValidGroupName] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity()) {
      setValidGroupName(true)
    } else {
      event.stopPropagation();
      setValidGroupName(false);
    }
    setValidated(true);
  };

  return (
    <div>
      <h1>Dutch Pay</h1>
      <Container>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <h1>먼저, 더치 페이 할 그룹의 이름을 정해볼까요?</h1>
          </Row>
          <Row>
            <Form.Group controlId="validataionGroupName">
              <Form.Control
                type="text"
                required
                placeholder="2022 제주도 여행"
                onChange={(event) => setGroupName(event.target.value)}
              />
              <Form.Control.Feedback type="invalid" data-valid={validGroupName}>그룹 이름을 입력해 주세요</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Button type="submit">저장</Button>
          <Row>
          </Row>
        </Form>
      </Container>
      {/* <CenteredOverlayForm /> */}
    </div>
  )
};

export default CreateGroup;
