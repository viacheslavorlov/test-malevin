"use client";

import { useState } from "react";
import { useAuth } from "../lib/auth-context";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { UserPlusIcon, ClipboardListIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterPage() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(username, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
          <ClipboardListIcon className="size-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Журнал работ</h1>
      </div>

      <Card className="w-full max-w-sm shadow-lg shadow-blue-200/40">
        <CardHeader>
          <CardTitle>Регистрация</CardTitle>
          <CardDescription>Создайте аккаунт для ведения журнала работ</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <UserPlusIcon className="size-4" />
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </form>
          <p className="text-sm text-center mt-4 text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Войти
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
