import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuestionRenderer } from './question-renderer';
import type { QuizQuestion } from '@workspace/contracts';

const mockNumberQuestion: QuizQuestion = {
  id: 'test-number',
  question: 'How many kWh do you use per month?',
  type: 'number',
  category: 'energy',
  validation: {
    min: 0,
    max: 5000,
    required: true,
  },
};

const mockSelectQuestion: QuizQuestion = {
  id: 'test-select',
  question: 'What type of diet do you follow?',
  type: 'single_choice',
  category: 'food',
  options: [
    'highMeat',
    'moderateMeat',
    'lowMeat',
    'vegetarian',
  ],
  validation: {
    required: true,
  },
};

describe('QuestionRenderer', () => {
  const mockOnSubmit = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Number Questions', () => {
    it('renders number question correctly', () => {
      render(
        <QuestionRenderer
          question={mockNumberQuestion}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('How many kWh do you use per month?')).toBeInTheDocument();
      expect(screen.getByText('Category: energy')).toBeInTheDocument();
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('validates min and max values for number input', async () => {
      render(
        <QuestionRenderer
          question={mockNumberQuestion}
          onSubmit={mockOnSubmit}
        />
      );

      const input = screen.getByRole('spinbutton');
      const submitButton = screen.getByText('Next');

      // Test that input accepts max value correctly
      await userEvent.clear(input);
      await userEvent.type(input, '5000');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(5000);
      });

      // Test that input accepts min value correctly
      mockOnSubmit.mockClear();
      await userEvent.clear(input);
      await userEvent.type(input, '0');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(0);
      });
    });

    it('submits valid number input', async () => {
      render(
        <QuestionRenderer
          question={mockNumberQuestion}
          onSubmit={mockOnSubmit}
        />
      );

      const input = screen.getByRole('spinbutton');
      const submitButton = screen.getByText('Next');

      await userEvent.type(input, '1500');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(1500);
      });
    });
  });

  describe('Select Questions', () => {
    it('renders select question correctly', () => {
      render(
        <QuestionRenderer
          question={mockSelectQuestion}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('What type of diet do you follow?')).toBeInTheDocument();
      expect(screen.getByText('Category: food')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('shows validation error when no option is selected', async () => {
      render(
        <QuestionRenderer
          question={mockSelectQuestion}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByText('Next');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Please select an option/)).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('submits selected option', async () => {
      render(
        <QuestionRenderer
          question={mockSelectQuestion}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByText('Next');

      // Radix Select creates a hidden native select for form integration
      // We can test by accessing this hidden select directly
      const hiddenSelect = document.querySelector('select[aria-hidden="true"]') as HTMLSelectElement;
      expect(hiddenSelect).toBeInTheDocument();

      // Simulate selecting the vegetarian option
      fireEvent.change(hiddenSelect, { target: { value: 'vegetarian' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('vegetarian');
      });
    });
  });

  describe('Navigation', () => {
    it('shows Back button when onBack is provided', () => {
      render(
        <QuestionRenderer
          question={mockNumberQuestion}
          onSubmit={mockOnSubmit}
          onBack={mockOnBack}
        />
      );

      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('does not show Back button when onBack is not provided', () => {
      render(
        <QuestionRenderer
          question={mockNumberQuestion}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.queryByText('Back')).not.toBeInTheDocument();
    });

    it('calls onBack when Back button is clicked', () => {
      render(
        <QuestionRenderer
          question={mockNumberQuestion}
          onSubmit={mockOnSubmit}
          onBack={mockOnBack}
        />
      );

      const backButton = screen.getByText('Back');
      fireEvent.click(backButton);

      expect(mockOnBack).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('shows loading state on submit button', () => {
      render(
        <QuestionRenderer
          question={mockNumberQuestion}
          onSubmit={mockOnSubmit}
          loading={true}
        />
      );

      expect(screen.getByText('Submitting...')).toBeInTheDocument();
    });

    it('disables form elements when loading', () => {
      render(
        <QuestionRenderer
          question={mockNumberQuestion}
          onSubmit={mockOnSubmit}
          onBack={mockOnBack}
          loading={true}
        />
      );

      expect(screen.getByRole('spinbutton')).toBeDisabled();
      expect(screen.getByText('Submitting...')).toBeDisabled();
      expect(screen.getByText('Back')).toBeDisabled();
    });
  });

  describe('Error State', () => {
    it('displays error message when provided', () => {
      render(
        <QuestionRenderer
          question={mockNumberQuestion}
          onSubmit={mockOnSubmit}
          error="Something went wrong"
        />
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Default Values', () => {
    it('sets default value for number input', () => {
      render(
        <QuestionRenderer
          question={mockNumberQuestion}
          onSubmit={mockOnSubmit}
          defaultValue={5000}
        />
      );

      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('5000');
    });

    it('sets default value for select input', () => {
      render(
        <QuestionRenderer
          question={mockSelectQuestion}
          onSubmit={mockOnSubmit}
          defaultValue="vegetarian"
        />
      );

      // For Radix Select, check that the button (combobox) displays the selected value
      const selectButton = screen.getByRole('combobox');
      expect(selectButton).toHaveTextContent('vegetarian');
    });

    it('clears invalid default value for select input', () => {
      render(
        <QuestionRenderer
          question={mockSelectQuestion}
          onSubmit={mockOnSubmit}
          defaultValue="invalidOption"
        />
      );

      // For Radix Select, check that placeholder is shown (not the invalid option)
      const selectButton = screen.getByRole('combobox');
      expect(selectButton).toHaveTextContent('Select an option...');
      expect(selectButton).not.toHaveTextContent('invalidOption');
    });
  });

  describe('Question Changes', () => {
    it('resets form when question changes', () => {
      const { rerender } = render(
        <QuestionRenderer
          question={mockSelectQuestion}
          onSubmit={mockOnSubmit}
          defaultValue="vegetarian"
        />
      );

      // Check that default value is shown initially
      const selectButton = screen.getByRole('combobox');
      expect(selectButton).toHaveTextContent('vegetarian');

      // Change to a different question with different options
      const newQuestion: QuizQuestion = {
        id: 'test-transport',
        question: 'How do you usually commute?',
        type: 'single_choice',
        category: 'energy',
        options: ['car', 'bus', 'bike', 'walk'],
        validation: { required: true },
      };

      rerender(
        <QuestionRenderer
          question={newQuestion}
          onSubmit={mockOnSubmit}
          defaultValue="vegetarian" // This should be cleared since it's not a valid option
        />
      );

      // Should show placeholder since "vegetarian" is not a valid option for transport
      const newSelectButton = screen.getByRole('combobox');
      expect(newSelectButton).toHaveTextContent('Select an option...');
      expect(newSelectButton).not.toHaveTextContent('vegetarian');
    });

    it('keeps valid default value when question changes', () => {
      const { rerender } = render(
        <QuestionRenderer
          question={mockSelectQuestion}
          onSubmit={mockOnSubmit}
          defaultValue="vegetarian"
        />
      );

      // Check that default value is shown initially
      const selectButton = screen.getByRole('combobox');
      expect(selectButton).toHaveTextContent('vegetarian');

      // Change to a different question that still has 'vegetarian' as an option
      const newQuestion: QuizQuestion = {
        id: 'test-diet-2',
        question: 'What is your preferred diet?',
        type: 'single_choice',
        category: 'food',
        options: ['meat', 'vegetarian', 'vegan'],
        validation: { required: true },
      };

      rerender(
        <QuestionRenderer
          question={newQuestion}
          onSubmit={mockOnSubmit}
          defaultValue="vegetarian" // This should be kept since it's a valid option
        />
      );

      // Should still show 'vegetarian' since it's a valid option in the new question
      const newSelectButton = screen.getByRole('combobox');
      expect(newSelectButton).toHaveTextContent('vegetarian');
    });
  });
});