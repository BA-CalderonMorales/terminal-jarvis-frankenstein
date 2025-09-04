import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'module';
import ts from 'typescript';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const source = readFileSync(resolve(__dirname, '../lib/url-validator.ts'), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const context = { module: { exports: {} }, require, URL };
context.exports = context.module.exports;
vm.runInNewContext(outputText, context);
const { isValidUrlFormat } = context.module.exports;

assert.strictEqual(isValidUrlFormat('https://example.com'), true);
assert.strictEqual(isValidUrlFormat('notaurl'), false);

console.log('e2b-integration tests passed');
