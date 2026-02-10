import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { login } from "../api/auth";
import { setAccessToken } from "../auth/token";

const glass = "rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl";

export function LoginPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const mut = useMutation({
    mutationFn: () => login({ username: username.trim(), password }),
    onSuccess: (data) => {
      setAccessToken(data.data.access_token);
      toast.success("Login realizado!");
      nav("/areas");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Falha no login");
    },
  });

  return (
    <>
    <Toaster position="top-right"/>
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center p-4">
        <div className="grid w-full gap-6 md:grid-cols-2">
          {/* Lado esquerdo: Branding */}
          <div className="hidden md:block">
            <div className={`${glass} p-8`}>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Gestão de Processos por Área
              </h1>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Visualize e organize processos em árvore, mova por drag-and-drop, edite status,
                responsáveis, documentos e ferramentas — tudo em um fluxo claro.
              </p>
            </div>
          </div>

          {/* Lado direito: Form */}
          <div className="flex items-center">
            <div className={`${glass} w-full p-6 md:p-8`}>
              <div className="text-sm text-slate-300">Acesso</div>
              <h2 className="mt-1 text-2xl font-semibold">Entrar</h2>
              <p className="mt-2 text-sm text-slate-300">
                Informe seu usuário e senha para acessar o painel.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm text-slate-300">Usuário</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="usuário"
                    className="mt-1 w-full rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:ring-sky-500/40"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300">Senha</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    type="password"
                    className="mt-1 w-full rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:ring-sky-500/40"
                    autoComplete="current-password"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && username.trim() && password) mut.mutate();
                    }}
                  />
                </div>

                <button
                  disabled={mut.isPending || !username.trim() || !password}
                  onClick={() => mut.mutate()}
                  className="w-full rounded-xl bg-sky-500/20 px-4 py-2 text-sm ring-1 ring-sky-500/30 hover:bg-sky-500/25 disabled:opacity-50"
                >
                  {mut.isPending ? "Entrando..." : "Entrar"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
}
