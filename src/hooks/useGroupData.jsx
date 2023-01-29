import { API } from "aws-amplify";
import { useEffect } from "react"
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { groupIdState } from "../state/groupId";
import { groupNameState } from "../state/groupName";
import { groupMembersState } from '../state/groupMembers';
import { expensesState } from '../state/expenses';

export const useGroupData = () => {
  const { guid } = useParams();
  const [groupName, setGroupName] = useRecoilState(groupNameState);
  const [groupId, setGroupId] = useRecoilState(groupIdState);
  const [groupMembers, setMembers] = useRecoilState(groupMembersState);
  const [expenses, setExpenses] = useRecoilState(expensesState);

  const fetchAndSetGroupData = () => {
    API.get('groupsApi', `/groups/${guid}`)
      .then(({ data }) => {
        console.log(data)
        setGroupName(data.groupName);
        setGroupId(data.guid);
        setMembers(data.members);
        setExpenses(data.expenses || []);
      })
      .catch(error => {
        alert('데이터를 불러오는데 실패했습니다.');
        console.log(error.response);
      })
  }
  useEffect(() => {
    if (guid?.length > 0) {
      fetchAndSetGroupData();
    }
  }, [guid]);

  return {
    groupId,
    groupName,
    groupMembers,
    expenses
  }
}