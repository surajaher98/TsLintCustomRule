import * as Lint from 'tslint';
import { Rules, RuleWalker } from 'tslint';
import * as ts from 'typescript';
const path = require('path');
const fs = require('fs');


export class Rule extends Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'must-have-index-file',
        description: 'Warns the user to have inde.ts file in component, services, pipes, module, constants folder',
        descriptionDetails: 'Warns the user to have inde.ts file in component, services, pipes, module, constants folder',
        hasFix: true,
        optionsDescription: 'Not configurable.',
        options: null,
        optionExamples: [true],
        type: 'functionality',
        typescriptOnly: false,
    };
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        
        // tslint:disable-next-line: no-use-before-declare
        return this.applyWithWalker(new IndexFileWalker(sourceFile, this.getOptions()));
    }
}

// The walker takes care of all the work.
// tslint:disable-next-line: deprecation
class IndexFileWalker extends RuleWalker {
    public visitImportDeclaration(node: ts.ImportDeclaration) {
        if (path.dirname(node.getSourceFile().fileName).includes('.module')) { 
          let dirPath =  path.dirname(node.getSourceFile().fileName);
          if (dirPath.includes('components/')) {
           dirPath =  removeComponentNameFromPath(dirPath);
          } 
      
          if (!fs.existsSync(dirPath + '/index.ts') && (!node.getSourceFile().fileName.includes('-routing.module.ts'))) {
            const failureMessage = dirPath.split('/').pop() + ' must contain the index file';
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), failureMessage));
            super.visitImportDeclaration(node);

          }
        }
                
    }
}
function removeComponentNameFromPath(pathWithComponent)
{
    const the_arr = pathWithComponent.split('/');
    the_arr.pop();
    return( the_arr.join('/') );
}
