import React from 'react';
import { render, screen } from '@testing-library/react';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage,
  useFormField
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Mock all the Radix UI dependencies that are causing issues
jest.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, ...props }: any) => <div data-testid="mock-slot" {...props}>{children}</div>
}));

jest.mock('@radix-ui/react-label', () => ({
  Root: ({ children, ...props }: any) => <label data-testid="mock-label" {...props}>{children}</label>
}));

// Create a test schema
const testSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

// Comprehensive test form using all Form components
const CompleteTestForm = () => {
  const form = useForm<z.infer<typeof testSchema>>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  });

  const onSubmit = (data: z.infer<typeof testSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} data-testid="complete-form">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} data-testid="username-field" />
              </FormControl>
              <FormDescription>Enter your username.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} data-testid="email-field" />
              </FormControl>
              <FormDescription>Enter your email address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
};

// Simple form for basic testing
const SimpleTestForm = () => {
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
    },
  });

  return (
    <Form {...form}>
      <form data-testid="test-form">
        <Input
          name="username"
          placeholder="Enter username"
          data-testid="username-input"
        />
        <Input
          name="email"
          type="email"
          placeholder="Enter email"
          data-testid="email-input"
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
};

// Component to test error case
const TestFormFieldError = () => {
  // Add a try/catch to trigger the error
  let error = null;
  try {
    // This should throw an error since we're outside FormField
    useFormField();
  } catch (e) {
    error = e;
  }

  return <div data-testid="form-field-error">{error ? 'Error triggered' : 'No error'}</div>;
};

// Component to test FormMessage with no children or errors
const TestFormMessageNull = () => {
  const form = useForm();
  
  return (
    <Form {...form}>
      <FormField
        name="test"
        control={form.control}
        render={() => (
          <FormItem>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
};

// Component to test FormMessage with custom children
const TestFormMessageWithChildren = () => {
  const form = useForm();
  
  return (
    <Form {...form}>
      <FormField
        name="test"
        control={form.control}
        render={() => (
          <FormItem>
            <FormMessage data-testid="form-message-with-children">Custom Message</FormMessage>
          </FormItem>
        )}
      />
    </Form>
  );
};

// Component to test FormMessage with error
const TestFormMessageWithError = () => {
  const form = useForm({
    defaultValues: { test: '' },
    mode: 'onChange',
  });
  
  // Set the error
  React.useEffect(() => {
    form.setError('test', { type: 'manual', message: 'Test error' });
  }, []);
  
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="test"
        render={() => (
          <FormItem>
            <FormMessage data-testid="form-message-with-error" />
          </FormItem>
        )}
      />
    </Form>
  );
};

// Component to test FormItem with custom className
const TestFormItemCustomClass = () => {
  const form = useForm();
  
  return (
    <Form {...form}>
      <FormItem className="custom-form-item" data-testid="custom-form-item">
        <div>Content</div>
      </FormItem>
    </Form>
  );
};

// Component to test FormLabel with error
const TestFormLabelWithError = () => {
  const form = useForm({
    defaultValues: { test: '' },
    mode: 'onChange',
  });
  
  // Set the error in useEffect to avoid infinite renders
  React.useEffect(() => {
    form.setError('test', { type: 'manual', message: 'Test error' });
  }, []);
  
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="test"
        render={() => (
          <FormItem>
            <FormLabel data-testid="form-label">Test Label</FormLabel>
          </FormItem>
        )}
      />
    </Form>
  );
};

// Component to test FormControl with aria attributes
const TestFormControlWithError = () => {
  const form = useForm();
  
  // Set the error
  React.useEffect(() => {
    form.setError('test', { type: 'manual', message: 'Test error' });
  }, []);
  
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="test"
        render={() => (
          <FormItem>
            <FormControl data-testid="form-control-with-error">
              <input />
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  );
};

// Component to test FormControl without error
const TestFormControlWithoutError = () => {
  const form = useForm();
  
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="test"
        render={() => (
          <FormItem>
            <FormControl data-testid="form-control-without-error">
              <input />
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  );
};

// Component to test FormDescription with custom className
const TestFormDescriptionWithClass = () => {
  const form = useForm();
  
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="test"
        render={() => (
          <FormItem>
            <FormDescription className="custom-description" data-testid="form-description">
              Custom description text
            </FormDescription>
          </FormItem>
        )}
      />
    </Form>
  );
};

describe('Form Component', () => {
  it('renders form with basic inputs', () => {
    render(<SimpleTestForm />);
    expect(screen.getByTestId('test-form')).toBeInTheDocument();
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('renders complete form with all form components', () => {
    render(<CompleteTestForm />);
    expect(screen.getByTestId('complete-form')).toBeInTheDocument();
    expect(screen.getByTestId('username-field')).toBeInTheDocument();
    expect(screen.getByTestId('email-field')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Enter your username.')).toBeInTheDocument();
    expect(screen.getByText('Enter your email address.')).toBeInTheDocument();
  });

  it('triggers error when useFormField is used outside FormField', () => {
    render(<TestFormFieldError />);
    expect(screen.getByTestId('form-field-error')).toHaveTextContent('Error triggered');
  });

  it('renders FormMessage as null when no error or children', () => {
    const { container } = render(<TestFormMessageNull />);
    
    // The FormMessage should render null (no element)
    expect(container.querySelector('.text-red-500')).not.toBeInTheDocument();
  });

  it('renders FormMessage with custom children', () => {
    render(<TestFormMessageWithChildren />);
    const message = screen.getByTestId('form-message-with-children');
    expect(message).toHaveTextContent('Custom Message');
    expect(message).toHaveClass('text-sm font-medium text-red-500');
  });

  it('renders FormMessage with error message', () => {
    render(<TestFormMessageWithError />);
    const message = screen.getByTestId('form-message-with-error');
    expect(message).toHaveTextContent('Test error');
    expect(message).toHaveClass('text-sm font-medium text-red-500');
  });

  it('renders FormItem with custom className', () => {
    render(<TestFormItemCustomClass />);
    const formItem = screen.getByTestId('custom-form-item');
    expect(formItem).toHaveClass('custom-form-item');
    expect(formItem).toHaveClass('space-y-2');
  });

  it('renders FormLabel with error class when there is an error', () => {
    render(<TestFormLabelWithError />);
    const label = screen.getByTestId('form-label');
    expect(label).toHaveClass('text-red-500');
  });

  it('renders FormControl with aria-invalid when there is an error', () => {
    render(<TestFormControlWithError />);
    const control = screen.getByTestId('form-control-with-error');
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(control).toHaveAttribute('aria-describedby');
    // Check that it includes both description and message IDs
    const describedBy = control.getAttribute('aria-describedby') || '';
    expect(describedBy.split(' ').length).toBe(2);
  });

  it('renders FormControl with only description ID when no error', () => {
    render(<TestFormControlWithoutError />);
    const control = screen.getByTestId('form-control-without-error');
    expect(control).toHaveAttribute('aria-invalid', 'false');
    expect(control).toHaveAttribute('aria-describedby');
    // Check that it only includes the description ID
    const describedBy = control.getAttribute('aria-describedby') || '';
    expect(describedBy.split(' ').length).toBe(1);
  });

  it('renders FormDescription with custom className', () => {
    render(<TestFormDescriptionWithClass />);
    const description = screen.getByTestId('form-description');
    expect(description).toHaveClass('custom-description');
    expect(description).toHaveClass('text-sm text-gray-500');
    expect(description).toHaveTextContent('Custom description text');
  });
}); 