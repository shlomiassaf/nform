import * as Path from 'path';
import { stringToFileBuffer } from '@angular-devkit/core/src/virtual-fs/host';
import { strings, normalize, join } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  SchematicContext,
  Tree,
  apply,
  applyTemplates,
  chain,
  filter,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics';
import { parseName } from '@schematics/angular/utility/parse-name';
import { stringsExtensions, getWorkspace } from './utils';
import { addDeclarationToNgModule, addLazyLoadingRouteDeclaration } from './ast';

function createPath(root: string, name: string) {
  const pathParts = name.split('/');
  name = pathParts.pop();
  pathParts.push(strings.dasherize(name));
  return parseName(`${root}/${pathParts.join('/') }`, name);
}

function buildSelector(prefix: string, name: string) {
  return `${prefix}-${strings.dasherize(name)}-example`;
}

function createMarkdown(title: string, selector: string, path: string) {
  const parent = path.substr(0, path.lastIndexOf('/'));
  return `---
title: ${title}
path: ${path}
parent: ${parent}
---
# ${title}

<div pbl-example-view="${selector}"></div>
`;
}

export default function(options: { name: string; add?: string; }): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const workspace = await getWorkspace();
    const projectName = workspace.getDefaultProjectName(); // TODO: allow from options.
    const project = workspace.getProject(projectName)
    const CONTENT_ROOT = `/${project.root}content`;
    const projectPrefix = project.prefix;
    const parsedPath = createPath(CONTENT_ROOT, options.name);
    const fullPath = Path.join(parsedPath.path, stringsExtensions.componentFile(parsedPath.name) + '.ts');
    const componentFileExists = tree.exists(fullPath);
    options.name = parsedPath.name;

    if (!options.add && componentFileExists) {
      throw new SchematicsException(`${options.name} already exists, use "-add" to add more examples.`);
    }

    let rules: Rule[] = [];

    if (!componentFileExists) {
      const selector = buildSelector(projectPrefix, parsedPath.name);
      const title = strings.underscore(parsedPath.name).split('_').map(strings.capitalize).join(' ');
      const templateSource = apply(url('./files'), [
        applyTemplates({
          ...strings,
          ...stringsExtensions,
          name: parsedPath.name,
          selector,
          style: 'scss',
          title,
        }),
        move(parsedPath.path),
      ]);

      const buffer = stringToFileBuffer(createMarkdown(title, selector, parsedPath.path.substr(CONTENT_ROOT.length + 1)));
      const mdRelFilePath = normalize(parsedPath.path + '/index.md');
      await workspace.host.write(join(workspace.root, mdRelFilePath), buffer).toPromise();
      console.log(`create ${mdRelFilePath} (${buffer.byteLength} bytes)`);

      rules.push(
        mergeWith(templateSource),
      );
    }

    if (options.add) {
      const additional = options.add.split(',').map( a => a.trim() );
      for (const additionalExampleName of additional) {
        const addParsedPath = { path: parsedPath.path, name: additionalExampleName };
        const addSelector = buildSelector(projectPrefix, addParsedPath.name);
        const addTitle = strings.underscore(addParsedPath.name).split('_').map(strings.capitalize).join(' ');
        const addTemplateSource = apply(url('./files'), [
          filter(path => !path.endsWith('.module.ts.template')),
          applyTemplates({
            ...strings,
            ...stringsExtensions,
            name: addParsedPath.name,
            selector: addSelector,
            style: 'scss',
            title: addTitle,
          }),
          move(parsedPath.path),
        ]);

        console.log(`<div pbl-example-view="${addSelector}"></div>\n`);

        rules.push(
          addDeclarationToNgModule(parsedPath, addParsedPath.name),
          mergeWith(addTemplateSource)
        );
      }
    }

    rules.push(
      addLazyLoadingRouteDeclaration(CONTENT_ROOT, parsedPath, 'lazy-modules-as-routes.ts', 'ELEMENT_MODULE_PATHS_AS_ROUTES'),
    );

    return rules.length ? chain(rules) : Promise.resolve( () => tree );
  }
}
