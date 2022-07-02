import * as vscode from 'vscode';

const hscopes: any = vscode.extensions.getExtension('draivin.hscopes');

export async function activate(context: vscode.ExtensionContext) {

	const highlighter = vscode.window.createTextEditorDecorationType({
		borderWidth: '4px',
		borderRadius: '4px',
		light: {
			// this color will be used in light color themes
			backgroundColor: 'yellow',
			color: 'black'
		},
		dark: {
			// this color will be used in dark color themes
			backgroundColor: 'yellow',
			color: 'black'
		}
	});

	const extensionOutputChannel = vscode.window.createOutputChannel('scopes', 'yaml');
	let disposable = vscode.commands.registerCommand('vscode-show-scopes.show', async () => {
		const activeTextEditor = vscode.window.activeTextEditor;
		if (activeTextEditor) {
			const token = hscopes.exports.getScopeAt(activeTextEditor.document, activeTextEditor.selection.active);
			if (token) {
				console.log(JSON.stringify(token, null, '  '));
				extensionOutputChannel.show(true);
				let text = (`'${token.text}'`);
				if (text.length > 120) {
					text = `${text.substring(0, 116)}...'`;
				}
				extensionOutputChannel.appendLine(`\n---\nText: ${text}\nLength: ${token.text.length}\nScopes:\n  - ${token.scopes.sort().join('\n  - ')}`);

				activeTextEditor.setDecorations(highlighter, []);
				let counter = 0;
				const intervalId = setInterval(() => {
					if (counter++ > 7) {
						clearInterval(intervalId);
					}
					if ((counter % 2) === 0) {
						activeTextEditor.setDecorations(highlighter, [token.range]);
					} else {
						activeTextEditor.setDecorations(highlighter, []);
					}
				}, 100);
			}
		}
	});

	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('vscode-show-scopes.show-inspector', async () => {
		const activeTextEditor = vscode.window.activeTextEditor;
		if (activeTextEditor) {
			vscode.commands.executeCommand('editor.action.inspectTMScopes');
		}
	});

	context.subscriptions.push(disposable);


}

export function deactivate() { }
