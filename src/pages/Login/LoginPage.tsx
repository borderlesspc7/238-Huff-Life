"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/Card/Card";
import { Button } from "../../components/ui/Button/Button";
import { Input } from "../../components/ui/Input/Input";
import { useNavigate, Link } from "react-router-dom";
import { paths } from "../../routes/paths";
import { useAuth } from "../../hooks/useAuth";
import { FaReact } from "react-icons/fa";
import "./LoginPage.css";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, error, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate(paths.dashboard);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Card variant="elevated">
          <CardHeader>
            <div className="login-logo">
              <div className="logo-icon">
                <FaReact />
              </div>
              <h1 className="logo-title">Huff Life</h1>
              <p className="logo-subtitle">Fazer Login</p>
            </div>
            <CardTitle>Entrar no sistema</CardTitle>
            <CardDescription>Faça login para continuar</CardDescription>
          </CardHeader>

          <CardContent>
            <form className="login-form" onSubmit={handleSubmit}>
              <Input
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(value) => handleInputChange("email", value)}
                required
              />
              <Input
                label="Senha"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={(value) => handleInputChange("password", value)}
                required
              />
              <div className="form-actions">
                <Button fullWidth type="submit" disabled={loading}>
                  {loading ? "Carregando..." : "Entrar"}
                </Button>
                {error && <div className="status-message error">{error}</div>}

                <div className="forgot-password">
                  <button type="button">Esqueci minha senha</button>
                </div>

                <div className="register-link">
                  <Link to={paths.register}>
                    Não tem uma conta? Cadastre-se
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
