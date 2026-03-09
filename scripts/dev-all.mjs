import { spawn } from "node:child_process";

const commands = [
	{ name: "site", cmd: "npm", args: ["run", "dev:site"] },
	{ name: "cms", cmd: "npm", args: ["run", "dev:cms"] },
	{ name: "cms-proxy", cmd: "npm", args: ["run", "dev:cms:proxy"] },
];

const procs = commands.map(({ name, cmd, args }) => {
	const child = spawn(cmd, args, {
		stdio: "inherit",
		shell: process.platform === "win32",
	});
	child.on("exit", (code) => {
		if (code !== 0) {
			console.error(`[dev:${name}] exited with code ${code}`);
			process.exit(code ?? 1);
		}
	});
	return child;
});

process.on("SIGINT", () => {
	for (const child of procs) {
		child.kill("SIGINT");
	}
	process.exit();
});
