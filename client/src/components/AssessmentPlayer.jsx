import React, { useState } from 'react';
import { evaluateAnswer } from '../services/api.js';

export function AssessmentPlayer({ questions, jobRole, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [userExplanation, setUserExplanation] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [completedAttempts, setCompletedAttempts] = useState([]);

  if (!questions || questions.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '36px', textAlign: 'center' }}>
        <h3>No questions available.</h3>
        <p style={{ color: 'var(--text-muted)' }}>Please regenerate the interview paper.</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSubmitCurrentAnswer = async () => {
    if (!selectedOption) return;

    setIsEvaluating(true);
    try {
      const response = await evaluateAnswer({
        questionText: currentQ.question,
        options: currentQ.options,
        correctAnswer: currentQ.correctAnswer,
        userSelectedOption: selectedOption,
        userExplanation: userExplanation.trim(),
        topic: currentQ.topic
      });

      const evaluation = response.evaluation || {
        isCorrect: selectedOption === currentQ.correctAnswer,
        correctAnswer: currentQ.correctAnswer,
        answerAnalysis: selectedOption === currentQ.correctAnswer ? 'Correct answer selected.' : 'Incorrect option chosen.',
        explanationAnalysis: userExplanation ? 'Explanation noted.' : 'No reasoning provided.',
        conceptualInsight: 'Revise core concepts.',
        recommendedAction: 'Practice similar problems.'
      };

      setCurrentFeedback(evaluation);

      const attemptRecord = {
        questionId: currentQ.id || currentIndex + 1,
        questionText: currentQ.question,
        topic: currentQ.topic,
        difficulty: currentQ.difficulty,
        selectedOption,
        correctAnswer: currentQ.correctAnswer,
        isCorrect: evaluation.isCorrect,
        userExplanation: userExplanation.trim(),
        feedback: evaluation
      };

      setCompletedAttempts(prev => [...prev, attemptRecord]);
    } catch (err) {
      console.error('Answer evaluation failed:', err);
      const isCorrect = selectedOption === currentQ.correctAnswer;
      const fallbackEval = {
        isCorrect,
        correctAnswer: currentQ.correctAnswer,
        answerAnalysis: isCorrect ? 'Your answer is correct!' : `Incorrect. The correct answer is ${currentQ.correctAnswer}.`,
        explanationAnalysis: userExplanation ? `Your rationale: "${userExplanation}".` : 'No explanation provided.',
        conceptualInsight: currentQ.explanation || 'Review topic notes.',
        recommendedAction: 'Review question fundamentals.'
      };
      setCurrentFeedback(fallbackEval);
      setCompletedAttempts(prev => [...prev, {
        questionId: currentQ.id || currentIndex + 1,
        questionText: currentQ.question,
        topic: currentQ.topic,
        difficulty: currentQ.difficulty,
        selectedOption,
        correctAnswer: currentQ.correctAnswer,
        isCorrect,
        userExplanation: userExplanation.trim(),
        feedback: fallbackEval
      }]);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete && onComplete(completedAttempts);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption('');
      setUserExplanation('');
      setCurrentFeedback(null);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '36px', maxWidth: '880px', margin: '0 auto' }}>
      {/* Progress Bar & Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-primary">{jobRole ? jobRole.title : 'Interview Exam'}</span>
            <span className="badge badge-cyan">{currentQ.topic || 'General'}</span>
            <span className={`badge ${currentQ.difficulty === 'Hard' ? 'badge-rose' : currentQ.difficulty === 'Easy' ? 'badge-emerald' : 'badge-amber'}`}>
              {currentQ.difficulty || 'Medium'}
            </span>
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>

        {/* Progress Line */}
        <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            width: `${((currentIndex + (currentFeedback ? 1 : 0)) / questions.length) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--primary), var(--accent-cyan))',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Question Prompt (Clear high-contrast text) */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.35rem', lineHeight: '1.5', color: 'var(--text-main)', fontWeight: 800 }}>
          {currentQ.question}
        </h3>
      </div>

      {/* MCQ Options with crisp contrast in Day & Night mode */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        {Object.entries(currentQ.options || {}).map(([key, text]) => {
          const isSelected = selectedOption === key;
          const isEvaluated = Boolean(currentFeedback);
          const isCorrect = key === currentFeedback?.correctAnswer;
          const isUserWrong = isEvaluated && isSelected && !currentFeedback?.isCorrect;

          let borderColor = 'var(--border-subtle)';
          let bgColor = 'var(--bg-secondary)';

          if (isSelected && !isEvaluated) {
            borderColor = 'var(--primary)';
            bgColor = 'rgba(37, 99, 235, 0.08)';
          } else if (isEvaluated) {
            if (isCorrect) {
              borderColor = 'var(--accent-emerald)';
              bgColor = 'rgba(16, 185, 129, 0.12)';
            } else if (isUserWrong) {
              borderColor = 'var(--accent-rose)';
              bgColor = 'rgba(244, 63, 94, 0.12)';
            }
          }

          return (
            <div
              key={key}
              onClick={() => !currentFeedback && setSelectedOption(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 22px',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${borderColor}`,
                background: bgColor,
                cursor: currentFeedback ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 0 16px var(--primary-glow)' : 'var(--shadow-subtle)'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.95rem',
                background: isSelected ? 'var(--primary)' : 'rgba(100, 116, 139, 0.1)',
                color: isSelected ? '#ffffff' : 'var(--text-main)',
                transition: 'all 0.2s ease'
              }}>
                {key}
              </div>
              <div style={{ flex: 1, fontSize: '1rem', color: 'var(--text-main)', fontWeight: 600, lineHeight: '1.4' }}>
                {text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional Explanation Input Field */}
      {!currentFeedback && (
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
            Why did you choose this answer? <span style={{ color: 'var(--primary)', fontWeight: 600 }}>(Optional - AI will evaluate your reasoning)</span>
          </label>
          <textarea
            rows="3"
            value={userExplanation}
            onChange={(e) => setUserExplanation(e.target.value)}
            placeholder="e.g., I selected this because L1 regularization adds an absolute penalty which mathematically zeroes out non-informative coefficients..."
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1.5px solid var(--border-subtle)',
              color: 'var(--text-main)',
              fontSize: '0.92rem',
              fontFamily: 'var(--font-body)',
              resize: 'vertical',
              outline: 'none',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.04)'
            }}
          />
        </div>
      )}

      {/* Feedback Panel Once Evaluated */}
      {currentFeedback && (
        <div className="animate-fade-in" style={{
          background: currentFeedback.isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
          border: `1.5px solid ${currentFeedback.isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '22px 26px',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>{currentFeedback.isCorrect ? '✅' : '❌'}</span>
            <strong style={{ fontSize: '1.1rem', color: currentFeedback.isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
              {currentFeedback.isCorrect ? 'Correct Choice!' : 'Incorrect Choice'}
            </strong>
            <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>
              Correct Option: {currentFeedback.correctAnswer}
            </span>
          </div>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '10px', lineHeight: '1.5' }}>
            <strong>Answer Analysis:</strong> {currentFeedback.answerAnalysis}
          </p>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: '1.5' }}>
            <strong>Reasoning Analysis:</strong> {currentFeedback.explanationAnalysis}
          </p>

          <div style={{ fontSize: '0.88rem', color: 'var(--primary)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '12px 16px', borderRadius: '8px' }}>
            💡 <strong>Conceptual Insight:</strong> {currentFeedback.conceptualInsight}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
          AI analyzes both option correctness and your technical explanation.
        </div>

        <div>
          {!currentFeedback ? (
            <button
              className="btn btn-primary"
              disabled={!selectedOption || isEvaluating}
              onClick={handleSubmitCurrentAnswer}
              style={{ padding: '12px 28px', fontSize: '0.98rem' }}
            >
              {isEvaluating ? 'Evaluating with AI...' : 'Submit Answer'}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleNext}
              style={{ padding: '12px 28px', fontSize: '0.98rem' }}
            >
              {isLastQuestion ? 'View Assessment Report ➔' : 'Next Question ➔'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssessmentPlayer;
