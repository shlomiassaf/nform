import * as Path from 'path';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/Typescript/lib/typescript';
import { NodeJsSyncHost } from '@angular-devkit/core/node';
import { strings, experimental, normalize } from '@angular-devkit/core';

const CWD = normalize(process.cwd());

export async function getWorkspace(): Promise<experimental.workspace.Workspace> {
  const host = new NodeJsSyncHost();
  return experimental.workspace.Workspace.fromPath(host, CWD, undefined);
}

export const stringsExtensions = {
  moduleFile: (name: string) => `${strings.dasherize(name)}.module`,
  componentFile: (name: string) => `${strings.dasherize(name)}.component`,
  moduleClassName: (name: string) => strings.classify(`${name}ExampleModule`),
  componentClassName: (name: string) => strings.classify(`${name}Example`),
}
