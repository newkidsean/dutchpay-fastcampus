import React from 'react'
import AddExpenseFrom from './AddExpenseFrom'

const ExpenseMain = () => {
  return (
    <div>ExpenseMain
      <div>
        <AddExpenseFrom />
        {/* 비용추가 */}
        {/* 정산 결과 컴포넌트 렌더링 */}
      </div>
      <div>
        {/* 그룹 헤더 */}
        {/* 비용리스트 컴포넌트 */}
      </div>
    </div>
  )
}

export default ExpenseMain