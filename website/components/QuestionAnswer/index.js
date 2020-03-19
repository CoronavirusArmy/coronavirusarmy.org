import React from "react";

const QuestionAnswer = ({question, answer}) => {

    return (
        <div className="question-answer">
            <h4>{question}</h4>
            <div>{answer}</div>
        </div>
    )

}

export default QuestionAnswer;