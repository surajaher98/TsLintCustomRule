import * as Lint from 'tslint';
import { Rules, RuleWalker } from 'tslint';
import * as ts from 'typescript';
const path = require('path');


export class Rule extends Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'module-folder-name',
        description: 'Warns the user to use suffix as .module in the module folder ',
        descriptionDetails: 'Warns the user to use suffix as .module in the module folder',
        hasFix: true,
        optionsDescription: 'Not configurable.',
        options: null,
        optionExamples: [true],
        type: 'functionality',
        typescriptOnly: false,
    };
    
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        // tslint:disable-next-line: no-use-before-declare
        return this.applyWithWalker(new ModuleNameWalker(sourceFile, this.getOptions()));
    }
}

// The walker takes care of all the work.
// tslint:disable-next-line: deprecation
class ModuleNameWalker extends RuleWalker {
    public visitImportDeclaration(node: ts.ImportDeclaration) {
        if (node.getSourceFile().fileName.includes('.module.ts')) {
            const dirPath =  path.dirname(node.getSourceFile().fileName);
          if (!(dirPath.match(/([^\/]*)\/*$/)[1].includes('.module')) && (dirPath.match(/([^\/]*)\/*$/)[1].trim() !== 'app')) {
            // console.log('dirPath', dirPath);
            // console.log('dirPathLast', dirPath.match(/([^\/]*)\/*$/)[1]);
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), 'module directory must have .module keyword as suffix '));
            super.visitImportDeclaration(node);
            }
        }        
    }
}
