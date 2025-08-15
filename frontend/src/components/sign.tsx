import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";


type AuthMode = 'signin' | 'signup';

type FormValues = {
  username: string;
  password: string;
};

const SignForm: React.FC<{ token: string | null, setToken: (token: string | null) => void }> = ({ token, setToken }) => {
  const [mode, setMode] = useState<AuthMode>('signin');

  const form = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });


  const Signup = async (data: FormValues) => {
            try {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (!response.ok) {
                throw new Error(result.error);
            }
                console.log('Sign Up Success:', result);
                setToken(result.token);
            } catch (error) {
                alert(error ? error : "An error occurred during sign up.");
            }
        };

    const Signin = async (data: FormValues) => {
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error);
            }

            console.log('Sign In Success:', result);
            setToken(result.token);
        } catch (error) {
            alert(error ? error : "An error occurred during sign in.");
        }
    }

  const onSubmit = async (data: FormValues) => {
    if (mode === 'signin') {
        await Signin(data);
    } else {
        await Signup(data);
        await Signin(data);
    }

    if (token) {
      console.log('User is authenticated:', token);
      localStorage.setItem("api_token", token);
      window.location.reload(); // Reload to update app state
    }
  };

  return (
    <div
      className="rounded-xl border bg-card p-6 shadow-md"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
      <div style={{ maxWidth: 400, width: "100%", margin: "auto", padding: 24, background: "white", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => setMode('signin')}
            style={{ marginRight: 8, fontWeight: mode === 'signin' ? 'bolder' : 'normal' }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            style={{ fontWeight: mode === 'signup' ? 'bolder' : 'normal' }}
          >
            Sign Up
          </button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" style={{ width: '100%' }}>
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        </Form>
      </div>
    </div>

  );
};

export default SignForm;