import os
import subprocess
import sys
import time

def main():
    port = os.environ.get("PORT", "10000")
    print(f"--> [Nyra 2.0] Starting FastAPI backend on 127.0.0.1:8000...", flush=True)
    
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"]
    )

    print(f"--> [Nyra 2.0] Waiting for backend to bind...", flush=True)
    time.sleep(2)

    cwd = os.getcwd()
    candidate_standalone_1 = os.path.join(cwd, "frontend", "server.js")
    candidate_standalone_2 = os.path.join(cwd, "frontend", ".next", "standalone", "server.js")
    
    env = os.environ.copy()
    env["PORT"] = str(port)
    env["HOSTNAME"] = "0.0.0.0"

    if os.path.exists(candidate_standalone_1):
        print(f"--> [Nyra 2.0] Starting Next.js standalone server from frontend/server.js on port {port}...", flush=True)
        frontend_proc = subprocess.Popen(
            ["node", "server.js"],
            cwd=os.path.join(cwd, "frontend"),
            env=env,
        )
    elif os.path.exists(candidate_standalone_2):
        print(f"--> [Nyra 2.0] Starting Next.js standalone server from frontend/.next/standalone on port {port}...", flush=True)
        frontend_proc = subprocess.Popen(
            ["node", "server.js"],
            cwd=os.path.join(cwd, "frontend", ".next", "standalone"),
            env=env,
        )
    else:
        print(f"--> [Nyra 2.0] Starting Next.js via npm run start on port {port}...", flush=True)
        frontend_proc = subprocess.Popen(
            ["npm", "run", "start", "--", "-p", str(port)],
            cwd=os.path.join(cwd, "frontend"),
            env=env,
        )

    print(f"--> [Nyra 2.0] All services running! Listening on port {port}", flush=True)

    try:
        while True:
            b_code = backend_proc.poll()
            f_code = frontend_proc.poll()
            if b_code is not None:
                print(f"[CRITICAL] Backend exited with code {b_code}", flush=True)
                sys.exit(b_code)
            if f_code is not None:
                print(f"[CRITICAL] Frontend exited with code {f_code}", flush=True)
                sys.exit(f_code)
            time.sleep(1)
    except KeyboardInterrupt:
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    main()
