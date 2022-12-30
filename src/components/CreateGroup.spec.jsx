import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateGroup from './CreateGroup';

const renderComponent = () => {
  render(<CreateGroup />);

  const input = screen.getByPlaceholderText('2022 제주도 여행');
  const saveButton = screen.getByText('저장');
  const errorMessage = screen.queryByText('그룹 이름을 입력해 주세요');

  return {
    input, saveButton, errorMessage
  }
}

describe('그룹 생성 페이지', () => {
  test('Create Group Component should be rendered', () => {
    const { input, saveButton } = renderComponent();

    expect(input).not.toBeNull();
    expect(saveButton).not.toBeNull();

  })

  test('Error message should be displayed when click save button without any group input', async () => {
    const { saveButton, errorMessage } = renderComponent();

    await userEvent.click(saveButton);

    expect(errorMessage).not.toBeNull();
  })

  test('Group name should be saved when click save button after filling in group name in input field', async () => {
    const { input, saveButton, errorMessage } = renderComponent();
    await userEvent.type(input, '예시 그룹명')
    await userEvent.click(saveButton);

    expect(errorMessage).toBeNull();
  })
})