import React from 'react'

const QuestionDetails = async ({ params }: RouteParams) => {
    const { id } = await params;
    return (
        <div>QuestionDetails Page : {id}</div>
    )
}

export default QuestionDetails