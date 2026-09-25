#!/usr/bin/env python3
"""Helper script to interact with cmux Computer Use (cmux-cua) via MCP stdio proxy."""

import argparse
import glob
import json
import os
import subprocess
import sys
import time
from typing import Any, Dict, List, Optional


def find_cmux_cua_environment() -> Dict[str, str]:
    uid = str(os.getuid())

    # Locate auth token
    auth_token = os.environ.get("CMUX_CUA_SOCKET_AUTH_TOKEN")
    if not auth_token:
        auth_file = os.environ.get("CMUX_CUA_AUTH_TOKEN_FILE")
        candidates = []
        if auth_file:
            candidates.append(auth_file)
        candidates.extend(glob.glob(f"/var/folders/*/*/*/cmux-cua-{uid}/com.cmuxterm.app/auth-token"))
        candidates.extend(glob.glob(f"/tmp/cmux-cua-{uid}/*/auth-token"))

        for path in candidates:
            if os.path.isfile(path):
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        token = f.read().strip()
                        if token:
                            auth_token = token
                            break
                except Exception:
                    continue

    if not auth_token:
        raise RuntimeError("Could not find cmux Computer Use auth token. Is cmux Computer Use enabled in Settings?")

    # Locate socket path
    sock_path = os.environ.get("CMUX_CUA_SOCKET_PATH")
    if not sock_path:
        sock_candidates = []
        sock_candidates.extend(glob.glob(f"/var/folders/*/*/*/cmux-cua-{uid}/com.cmuxterm.app/cmux-cua.sock"))
        sock_candidates.extend(glob.glob(f"/tmp/cmux-cua-{uid}/*/cmux-cua.sock"))

        for path in sock_candidates:
            if os.path.exists(path):
                sock_path = path
                break

    if not sock_path or not os.path.exists(sock_path):
        raise RuntimeError("Could not find cmux Computer Use socket. Is cmux running?")

    # Locate client binary
    client_bin = "/Applications/cmux.app/Contents/Resources/bin/cmux-cua"
    if not os.path.isfile(client_bin):
        raise RuntimeError(f"cmux-cua client binary not found at {client_bin}")

    return {
        "auth_token": auth_token,
        "sock_path": sock_path,
        "client_bin": client_bin,
    }


class CmuxCuaClient:
    def __init__(self, session_id: Optional[str] = None):
        self.env_info = find_cmux_cua_environment()
        self.session_id = session_id or f"cmux-{os.environ.get('CMUX_SURFACE_ID', os.getpid())}"
        self.process: Optional[subprocess.Popen] = None
        self.req_id = 0

    def start(self):
        env = os.environ.copy()
        env["CMUX_CUA_MCP_FORCE_PROXY"] = "1"
        env["CMUX_CUA_EXTERNAL_PERMISSION_FLOW"] = "1"
        env["CMUX_CUA_SOCKET_AUTH_TOKEN"] = self.env_info["auth_token"]
        env["CMUX_CUA_DEFAULT_SESSION"] = self.session_id
        env["CMUX_CUA_STATE_OWNER_PID"] = str(os.getpid())
        env["CMUX_CUA_CURSOR_GRADIENT"] = "#12c7f5,#2d8cff,#6c5cff"
        env["CMUX_CUA_CURSOR_BLOOM"] = "#2d8cff"
        env["CMUX_CUA_CURSOR_LABEL"] = "cmux"

        self.process = subprocess.Popen(
            [self.env_info["client_bin"], "mcp", "--socket", self.env_info["sock_path"]],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=env,
            text=True,
            bufsize=1,
        )

        init_res = self._rpc(
            "initialize",
            {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {"name": "cmux-cua-client", "version": "1.0"},
            },
        )
        return init_res

    def _rpc(self, method: str, params: Dict[str, Any]) -> Dict[str, Any]:
        if not self.process or self.process.poll() is not None:
            raise RuntimeError("cmux-cua MCP process is not running")

        self.req_id += 1
        payload = {"jsonrpc": "2.0", "id": self.req_id, "method": method, "params": params}
        self.process.stdin.write(json.dumps(payload) + "\n")
        self.process.stdin.flush()

        line = self.process.stdout.readline()
        if not line:
            stderr = self.process.stderr.read()
            raise RuntimeError(f"Empty response from cmux-cua MCP process. Stderr: {stderr}")

        res = json.loads(line)
        if "error" in res:
            raise RuntimeError(f"RPC Error ({res['error'].get('code')}): {res['error'].get('message')}")
        return res.get("result", {})

    def call_tool(self, name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        return self._rpc("tools/call", {"name": name, "arguments": arguments})

    def launch_app(self, bundle_id: Optional[str] = None, name: Optional[str] = None) -> Dict[str, Any]:
        args: Dict[str, Any] = {}
        if bundle_id:
            args["bundle_id"] = bundle_id
        if name:
            args["name"] = name
        return self.call_tool("launch_app", args)

    def bring_to_front(self, pid: int) -> Dict[str, Any]:
        return self.call_tool("bring_to_front", {"pid": pid})

    def list_windows(self) -> List[Dict[str, Any]]:
        res = self.call_tool("list_windows", {})
        return res.get("structuredContent", {}).get("windows", [])

    def get_window_state(
        self,
        pid: int,
        window_id: int,
        include_screenshot: bool = True,
        screenshot_out_file: Optional[str] = None,
    ) -> Dict[str, Any]:
        args: Dict[str, Any] = {
            "pid": pid,
            "window_id": window_id,
            "include_screenshot": include_screenshot,
        }
        if screenshot_out_file:
            args["screenshot_out_file"] = screenshot_out_file
        return self.call_tool("get_window_state", args)

    def click(
        self,
        pid: Optional[int] = None,
        window_id: Optional[int] = None,
        element_token: Optional[str] = None,
        element_index: Optional[int] = None,
        x: Optional[float] = None,
        y: Optional[float] = None,
    ) -> Dict[str, Any]:
        args: Dict[str, Any] = {}
        if pid is not None:
            args["pid"] = pid
        if window_id is not None:
            args["window_id"] = window_id
        if element_token is not None:
            args["element_token"] = element_token
        if element_index is not None:
            args["element_index"] = element_index
        if x is not None and y is not None:
            args["x"] = x
            args["y"] = y
        return self.call_tool("click", args)

    def perform_actions(self, actions: List[Dict[str, Any]], stop_on_error: bool = True) -> Dict[str, Any]:
        return self.call_tool("perform_actions", {"actions": actions, "stop_on_error": stop_on_error})

    def type_text(self, pid: int, text: str) -> Dict[str, Any]:
        return self.call_tool("type_text", {"pid": pid, "text": text})

    def press_key(self, pid: int, key: str) -> Dict[str, Any]:
        return self.call_tool("press_key", {"pid": pid, "key": key})

    def close(self):
        if self.process and self.process.poll() is None:
            self.process.terminate()
            try:
                self.process.wait(timeout=2)
            except subprocess.TimeoutExpired:
                self.process.kill()
            self.process = None

    def __enter__(self):
        self.start()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()


def main():
    parser = argparse.ArgumentParser(description="cmux Computer Use automation driver client")
    subparsers = parser.add_subparsers(dest="command", required=True)

    subparsers.add_parser("status", help="Check cmux Computer Use status")

    launch_p = subparsers.add_parser("launch", help="Launch an application")
    launch_p.add_argument("app", help="Application bundle ID or display name")

    inspect_p = subparsers.add_parser("inspect", help="Inspect window accessibility tree")
    inspect_p.add_argument("pid", type=int, help="Target process ID")
    inspect_p.add_argument("window_id", type=int, help="Target window ID")
    inspect_p.add_argument("--screenshot", help="Output file path for screenshot")

    args = parser.parse_args()

    if args.command == "status":
        env = find_cmux_cua_environment()
        print("cmux Computer Use environment detected:")
        print(f"  Socket: {env['sock_path']}")
        print(f"  Binary: {env['client_bin']}")
        with CmuxCuaClient() as client:
            print("Connected to cmux-cua MCP daemon successfully.")
        return

    if args.command == "launch":
        with CmuxCuaClient() as client:
            bundle_id = args.app if "." in args.app else None
            name = args.app if "." not in args.app else None
            res = client.launch_app(bundle_id=bundle_id, name=name)
            content = res.get("content", [{}])[0].get("text", "")
            print(content)
            structured = res.get("structuredContent", {})
            pid = structured.get("pid")
            if pid:
                client.bring_to_front(pid)
        return

    if args.command == "inspect":
        with CmuxCuaClient() as client:
            res = client.get_window_state(
                pid=args.pid,
                window_id=args.window_id,
                include_screenshot=bool(args.screenshot),
                screenshot_out_file=args.screenshot,
            )
            elements = res.get("structuredContent", {}).get("elements", [])
            print(f"Found {len(elements)} elements:")
            for el in elements:
                role = el.get("role")
                label = el.get("label")
                val = el.get("value")
                tok = el.get("element_token")
                idx = el.get("element_index")
                print(f"[{idx}] role={role} label={label} val={val} tok={tok}")
        return


if __name__ == "__main__":
    main()
