import * as React from 'react';

interface EmailTemplateProps {
  question: string;
  creator: string;
  answer: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  question,
  creator,
  answer
}) => (
  <div>
    <h1>Hellooooooo!</h1>
    <p>You asked this question: {question} to {creator} and they answered: {answer}</p>
  </div>
);
