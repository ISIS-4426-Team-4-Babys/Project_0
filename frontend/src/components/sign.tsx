import React, { useEffect, useState } from 'react';
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


const pps = [
  "https://www.lego.com/cdn/cs/set/assets/blt5106608431ab56b9/02_Emmet_top_Hero_w_block.jpg?fit=crop&format=jpg&quality=80&width=800&height=426&dpr=1",
  "https://platform.vox.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/7952371/legobatmancover.jpg?quality=90&strip=all&crop=7.8125,0,84.375,100",
  "https://ew.com/thmb/472JmfUozswCxY4Jb7yIIK3QRuc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/LEGO-SPIDER-MAN-ACROSS-THE-SPIDER-VERSE-01-060823-b4eca70b1c594de6aa9de422989a0902.jpg",
  "https://external-preview.redd.it/8Sn6amMRK0xH1blmK0TKPxDOh8-Gnj-7d7qLgs993G4.jpg?width=640&crop=smart&auto=webp&s=93e474c24df6a02de84deee77460b99057b6fcd7",
  "https://m.media-amazon.com/images/M/MV5BZWU2ZDI4ZGYtODNkMi00ODYyLWJhMTItMTNlNzkyYmU4ZDRkXkEyXkFqcGdeQVRoaXJkUGFydHlJbmdlc3Rpb25Xb3JrZmxvdw@@._V1_QL75_UX500_CR0,0,500,281_.jpg",
  "https://static01.nyt.com/images/2019/02/01/arts/01tvcol-legomovie/01tvcol-legomovie-articleLarge.jpg?quality=75&auto=webp&disable=upscale"
]

const SignForm: React.FC<{ token: string | null, setUser: (user: any) => void, setToken: (token: string | null) => void }> = ({ token, setToken, setUser }) => {
  const [mode, setMode] = useState<AuthMode>('signin');

  const form = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });


  const Signup = async (inData: FormValues) => {
            try {
              const data = {
                ...inData,
                profile_image: pps[Math.floor(Math.random() * pps.length)],
              };
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
            setUser(result.user);
            localStorage.setItem("api_token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
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

  useEffect(() => {
    const token = localStorage.getItem("api_token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setToken(token);
      setUser(JSON.parse(user));
    }
  }, []);

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