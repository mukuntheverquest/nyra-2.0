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

    print(f"--> [Nyra 2.0] Starting Next.js frontend on port {port}...", flush=True)
    frontend_dir = os.path.join(os.getcwd(), "frontend")
    
    frontend_proc = subprocess.Popen(
        ["npm", "run", "start", "--", "-p", str(port)],
        cwd=frontend_dir,
    )

    print(f"--> [Nyra 2.0] All services launched! Listening on port {port}", flush=True)

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
