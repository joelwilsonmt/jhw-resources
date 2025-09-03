import { createFileRoute } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { PageTransition } from '@/components/PageTransition';
import { AnimatedText } from '@/components/AnimatedText';
import { CheckCircle, AlertCircle, Users } from 'lucide-react';

// Zod schema for form validation
const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  age: z
    .number({ message: 'Age must be a number' })
    .min(13, 'Must be at least 13 years old')
    .max(120, 'Must be less than 120 years old'),
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be less than 500 characters'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  newsletter: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

function FormsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: undefined,
      bio: '',
      acceptTerms: false,
      newsletter: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    alert(
      `Form submitted successfully! Data: ${JSON.stringify(data, null, 2)}`
    );
    console.log('Form data:', data);
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <AnimatedText
            type="bounceIn"
            className="flex items-center justify-center gap-2"
          >
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Forms Demo</h1>
          </AnimatedText>
          <AnimatedText
            type="fadeIn"
            delay={0.3}
            className="text-muted-foreground"
          >
            <p>React Hook Form with Zod validation showcase</p>
          </AnimatedText>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              User Registration Form
            </CardTitle>
            <CardDescription>
              This form demonstrates React Hook Form with Zod validation,
              real-time error handling, and modern form patterns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    placeholder="John"
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    placeholder="Doe"
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email and Age */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="john.doe@example.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    placeholder="25"
                    className={errors.age ? 'border-red-500' : ''}
                  />
                  {errors.age && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.age.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  placeholder="Tell us about yourself..."
                  className={errors.bio ? 'border-red-500' : ''}
                />
                {errors.bio && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.bio.message}
                  </p>
                )}
              </div>

              {/* Switches */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="acceptTerms" className="font-medium">
                      Accept Terms & Conditions
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Required to create an account
                    </p>
                  </div>
                  <Controller
                    name="acceptTerms"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Switch
                        id="acceptTerms"
                        checked={value}
                        onCheckedChange={onChange}
                      />
                    )}
                  />
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.acceptTerms.message}
                  </p>
                )}

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="newsletter" className="font-medium">
                      Subscribe to Newsletter
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get updates about new features
                    </p>
                  </div>
                  <Controller
                    name="newsletter"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Switch
                        id="newsletter"
                        checked={value}
                        onCheckedChange={onChange}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Submit Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Form'}
                </Button>
                <Button type="button" variant="outline" onClick={() => reset()}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Features Info */}
        <Card>
          <CardHeader>
            <CardTitle>Form Features Demonstrated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">React Hook Form</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Uncontrolled components for performance</li>
                  <li>• Real-time validation</li>
                  <li>• Form state management</li>
                  <li>• Submit handling</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Zod Validation</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Type-safe schema validation</li>
                  <li>• Custom error messages</li>
                  <li>• Complex validation rules</li>
                  <li>• TypeScript integration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}

export const Route = createFileRoute('/forms')({
  component: FormsPage,
});
