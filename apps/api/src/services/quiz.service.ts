import type { QuizQuestion, QuizSession, QuizSubmissionResult } from '@workspace/contracts';

export class QuizService {
  private sessions = new Map<string, QuizSession>();

  private readonly questions: QuizQuestion[] = [
    {
      id: 'diet_type',
      category: 'food',
      question: 'What best describes your diet?',
      type: 'single_choice',
      options: [
        'High meat consumption (meat multiple times per day)',
        'Moderate meat consumption (meat once per day)',
        'Low meat consumption (meat few times per week)',
        'Vegetarian (no meat, but dairy and eggs)',
        'Vegan (no animal products)'
      ]
    },
    {
      id: 'food_source',
      category: 'food',
      question: 'How often do you eat locally sourced/organic food?',
      type: 'single_choice',
      options: [
        'Always (100% local/organic)',
        'Often (75% local/organic)',
        'Sometimes (50% local/organic)',
        'Rarely (25% local/organic)',
        'Never (0% local/organic)'
      ]
    },
    {
      id: 'energy_source',
      category: 'energy',
      question: 'What is your primary energy source?',
      type: 'single_choice',
      options: [
        'Renewable energy (solar, wind, hydro)',
        'Natural gas',
        'Coal-based electricity',
        'Nuclear power',
        'Mixed grid electricity (standard utility)'
      ]
    },
    {
      id: 'monthly_kwh',
      category: 'energy',
      question: 'What is your approximate monthly electricity consumption in kWh?',
      type: 'number',
      validation: {
        min: 0,
        max: 5000,
        required: true
      }
    }
  ];

  startSession(): string {
    const sessionId = this.generateSessionId();
    const session: QuizSession = {
      sessionId,
      currentQuestionIndex: 0,
      answers: {},
      completed: false,
      createdAt: new Date()
    };

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  getCurrentQuestion(sessionId: string): QuizQuestion | null {
    const session = this.sessions.get(sessionId);
    if (!session || session.completed) {
      return null;
    }

    return this.questions[session.currentQuestionIndex] || null;
  }

  submitAnswer(sessionId: string, answer: any): QuizSubmissionResult {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    if (session.completed) {
      return { success: false, error: 'Quiz already completed' };
    }

    const currentQuestion = this.questions[session.currentQuestionIndex];
    if (!currentQuestion) {
      return { success: false, error: 'No current question' };
    }

    // Validate answer
    const validation = this.validateAnswer(currentQuestion, answer);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Store answer
    session.answers[currentQuestion.id] = answer;
    session.currentQuestionIndex++;

    // Check if quiz is completed
    if (session.currentQuestionIndex >= this.questions.length) {
      session.completed = true;
      return { success: true, completed: true };
    }

    // Return next question
    const nextQuestion = this.questions[session.currentQuestionIndex];
    return { success: true, nextQuestion };
  }

  getSessionAnswers(sessionId: string): Record<string, any> | null {
    const session = this.sessions.get(sessionId);
    return session?.answers || null;
  }

  isSessionCompleted(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    return session?.completed || false;
  }

  private validateAnswer(question: QuizQuestion, answer: any): { valid: boolean; error?: string } {
    if (question.validation?.required && (answer === null || answer === undefined || answer === '')) {
      return { valid: false, error: 'Answer is required' };
    }

    if (question.type === 'single_choice') {
      if (!question.options?.includes(answer)) {
        return { valid: false, error: 'Invalid option selected' };
      }
    }

    if (question.type === 'number') {
      const num = Number(answer);
      if (isNaN(num)) {
        return { valid: false, error: 'Answer must be a number' };
      }

      if (question.validation?.min !== undefined && num < question.validation.min) {
        return { valid: false, error: `Answer must be at least ${question.validation.min}` };
      }

      if (question.validation?.max !== undefined && num > question.validation.max) {
        return { valid: false, error: `Answer must be at most ${question.validation.max}` };
      }
    }

    return { valid: true };
  }

  private generateSessionId(): string {
    return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}