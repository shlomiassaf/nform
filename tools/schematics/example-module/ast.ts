import * as ts from '@schematics/angular/third_party/github.com/Microsoft/Typescript/lib/typescript';
import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import { Change, InsertChange } from '@schematics/angular/utility/change';
import { getSourceNodes, addDeclarationToModule, addEntryComponentToModule, addExportToModule, findNode } from '@schematics/angular/utility/ast-utils';
import { buildRelativePath } from '@schematics/angular/utility/find-module';
import { Location } from '@schematics/angular/utility/parse-name';
import { stringsExtensions } from './utils';

export function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
  const text = host.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }
  const sourceText = text.toString('utf-8');

  return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}

export function addComponentToBindNgModule(source: ts.SourceFile,
                                           ngModulePath: string,
                                           symbolName: string,): Change[] {
  const nodes = getSourceNodes(source)
    .filter(node => ts.isDecorator(node) && node.expression.kind == ts.SyntaxKind.CallExpression )
    .map(node => (node as ts.Decorator).expression as ts.CallExpression )
    .filter( expr => {
      const identExp = expr.expression;
      return ts.isIdentifier(identExp) && identExp.text === 'BindNgModule';
    });

  let node: ts.CallExpression = nodes[0];  // tslint:disable-line:no-any

  // Find the decorator declaration.
  if (!node) {
    return [];
  }

  const position = node.arguments[node.arguments.length - 1].getEnd();
  return [
    new InsertChange(ngModulePath, position, `, ${symbolName}`),
  ];
}

export function addDeclarationToNgModule(parsedPath: Location, componentName: string): Rule {
  return (host: Tree) => {

    const modulePath = `/${parsedPath.path}/${stringsExtensions.moduleFile(parsedPath.name)}.ts`;
    const exampleModulePath = `/${parsedPath.path}/${stringsExtensions.componentFile(componentName)}`;
    const relativePath = buildRelativePath(modulePath, exampleModulePath);
    const classifiedName = stringsExtensions.componentClassName(componentName);
    let source = readIntoSourceFile(host, modulePath);

    const declarationChanges = addDeclarationToModule(source, modulePath, classifiedName, relativePath);
    const declarationRecorder = host.beginUpdate(modulePath);
    for (const change of declarationChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(declarationRecorder);

    // Need to refresh the AST because we overwrote the file in the host.
    source = readIntoSourceFile(host, modulePath);

    const exportRecorder = host.beginUpdate(modulePath);
    const exportChanges = addExportToModule(source, modulePath, classifiedName, relativePath);
    for (const change of exportChanges) {
      if (change instanceof InsertChange) {
        exportRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(exportRecorder);

    // Need to refresh the AST because we overwrote the file in the host.
    source = readIntoSourceFile(host, modulePath);

    const entryComponentRecorder = host.beginUpdate(modulePath);
    const entryComponentChanges = addEntryComponentToModule(source, modulePath, classifiedName, relativePath);
    for (const change of entryComponentChanges) {
      if (change instanceof InsertChange) {
        entryComponentRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(entryComponentRecorder);

    // Need to refresh the AST because we overwrote the file in the host.
    source = readIntoSourceFile(host, modulePath);
    const bindNgModuleRecorder = host.beginUpdate(modulePath);
    const bindNgModuleChanges = addComponentToBindNgModule(source, modulePath, classifiedName);
    for (const change of bindNgModuleChanges) {
      if (change instanceof InsertChange) {
        bindNgModuleRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(bindNgModuleRecorder);

    return host;
  };
}

export function addLazyLoadingRouteDeclaration(root: string, parsedPath: Location, fileName: string, varName: string): Rule {
  return (host: Tree) => {
    const modulePath = `${root}/${fileName}`;
    const source = readIntoSourceFile(host, modulePath);
    const node = findNode(source, ts.SyntaxKind.Identifier, varName);
    let insertChange: InsertChange;

    if (node && ts.isVariableDeclaration(node.parent)) {
      const arrLiteral = node.parent.initializer;
      if (arrLiteral && ts.isArrayLiteralExpression(arrLiteral)) {
        let lastNode: ts.Node;
        if (arrLiteral.elements.length === 0) {
          lastNode = arrLiteral;
        }
        else {
          lastNode = arrLiteral.elements[arrLiteral.elements.length - 1];
        }

        const pathToModuleDir = parsedPath.path.substr(root.length + 1);
        let toInsert = `
  {
    path: '${pathToModuleDir.split('/').join('-')}.module',
    pathMatch: 'full',
    loadChildren: () => import('./${pathToModuleDir}/${stringsExtensions.moduleFile(parsedPath.name)}').then( m => m.${stringsExtensions.moduleClassName(parsedPath.name)} ),
  }`;

        let position = lastNode.getEnd();

        if (lastNode === arrLiteral) {
          position--;
        } else {
          toInsert = ',' + toInsert;
        }

        insertChange = new InsertChange(modulePath, position, toInsert);
      }
    }

    if (insertChange) {
      const recorder = host.beginUpdate(modulePath);
      recorder.insertLeft(insertChange.pos, insertChange.toAdd);
      host.commitUpdate(recorder);
    }

    return host;
  };
}
